/**
 * Google Sheet Integration Service for Edtech Manager
 * Communicates with a deployed Google Apps Script Web App.
 */

export const GOOGLE_SHEET_STORAGE_KEY = 'eduone_googlesheet_url';
export const GOOGLE_SHEET_AUTOSYNC_KEY = 'eduone_googlesheet_autosync';

// The Google Apps Script template for the user to copy & paste into Google Sheet
export const APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * 🎓 EDTECH MANAGER - GOOGLE SHEET BACKEND API
 * =========================================================================
 * নির্দেশিকা (Instructions):
 * ১. একটি নতুন Google Sheet তৈরি করুন।
 * ২. Extensions > Apps Script এ যান।
 * ৩. পূর্বের সব কোড মুছে এই কোডটি পেস্ট করুন।
 * ৪. উপরে 'Save' বাটনে ক্লিক করুন।
 * ৫. ডানপাশে Deploy > New deployment সিলেক্ট করুন।
 * ৬. Select type > 'Web app' নির্বাচন করুন।
 * ৭. Who has access: 'Anyone' (বা 'Anyone with Google account') দিন।
 * ৮. 'Deploy' বাটনে ক্লিক করে полученная 'Web app URL' কপি করে অ্যাপে পেস্ট করুন!
 * =========================================================================
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'readAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'ping') {
    return createJsonResponse({ status: 'success', message: 'Edtech Manager Google Sheet Connected!' });
  }

  // Read all sheets
  var result = {
    status: 'success',
    timestamp: new Date().toISOString(),
    students: getSheetDataAsJson(ss, 'Students'),
    batches: getSheetDataAsJson(ss, 'Batches'),
    fees: getSheetDataAsJson(ss, 'Fee_Records'),
    attendance: getSheetDataAsJson(ss, 'Attendance')
  };

  return createJsonResponse(result);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var action = data.action || 'syncAll';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'syncAll') {
      if (data.students) syncSheet(ss, 'Students', data.students, [
        'id', 'roll', 'name', 'phone', 'guardianPhone', 'className', 'batchName', 'monthlyFee', 'dueAmount', 'attendanceRate', 'status'
      ]);
      if (data.batches) syncSheet(ss, 'Batches', data.batches, [
        'id', 'name', 'className', 'subject', 'teacher', 'schedule', 'room', 'seatLimit', 'enrolledCount', 'monthlyFee', 'status'
      ]);
      if (data.fees) syncSheet(ss, 'Fee_Records', data.fees, [
        'receiptNo', 'date', 'studentId', 'studentName', 'phone', 'month', 'feeType', 'amount', 'paidAmount', 'discount', 'paymentMethod', 'collectedBy'
      ]);
      if (data.attendance) syncAttendanceSheet(ss, 'Attendance', data.attendance);

      return createJsonResponse({ status: 'success', message: 'সকল ডাটা সফলভাবে গুগল শীটে সংরক্ষিত হয়েছে!' });
    }

    return createJsonResponse({ status: 'error', message: 'অজানা অ্যাকশন' });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// Helpers
function syncSheet(ss, sheetName, dataArray, keys) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();

  // Header
  sheet.appendRow(keys);
  sheet.getRange(1, 1, 1, keys.length).setFontWeight('bold').setBackground('#4F46E5').setFontColor('#FFFFFF');

  if (dataArray && dataArray.length > 0) {
    var rows = dataArray.map(function(item) {
      return keys.map(function(k) {
        var val = item[k];
        return val !== undefined && val !== null ? val : '';
      });
    });
    sheet.getRange(2, 1, rows.length, keys.length).setValues(rows);
  }
  sheet.autoResizeColumns(1, keys.length);
}

function syncAttendanceSheet(ss, sheetName, attendanceObj) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(['Date_Batch_Key', 'StudentID', 'Status']);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF');

  var rows = [];
  for (var key in attendanceObj) {
    var studentMap = attendanceObj[key];
    for (var stdId in studentMap) {
      rows.push([key, stdId, studentMap[stdId]]);
    }
  }

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  }
}

function getSheetDataAsJson(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0];
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

/**
 * Test connectivity with Google Apps Script Web App
 */
export async function testGoogleSheetConnection(webAppUrl) {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    throw new Error('দয়া করে সঠিক Web App URL প্রদান করুন');
  }

  const url = `${webAppUrl}${webAppUrl.includes('?') ? '&' : '?'}action=ping`;
  const res = await fetch(url, { method: 'GET', mode: 'cors' });
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }
  const json = await res.json();
  return json;
}

/**
 * Push all local data to Google Sheet
 */
export async function syncAllToGoogleSheet(webAppUrl, payload) {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    throw new Error('গুগল শীট Web App URL সেট করা নেই');
  }

  const body = JSON.stringify({
    action: 'syncAll',
    students: payload.students || [],
    batches: payload.batches || [],
    fees: payload.fees || [],
    attendance: payload.attendance || {}
  });

  const res = await fetch(webAppUrl, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body
  });

  const json = await res.json();
  return json;
}

/**
 * Fetch all data from Google Sheet
 */
export async function fetchFromGoogleSheet(webAppUrl) {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    throw new Error('গুগল শীট Web App URL সেট করা নেই');
  }

  const url = `${webAppUrl}${webAppUrl.includes('?') ? '&' : '?'}action=readAll`;
  const res = await fetch(url, { method: 'GET', mode: 'cors' });
  const json = await res.json();
  return json;
}
