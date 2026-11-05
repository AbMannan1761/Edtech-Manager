/**
 * Firebase Firestore Service for Edtech Manager
 * Supports syncing with Google Firebase Cloud Firestore.
 */

export const FIREBASE_CONFIG_KEY = 'eduone_firebase_config';
export const FIREBASE_AUTOSYNC_KEY = 'eduone_firebase_autosync';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

/**
 * Get current saved Firebase config
 */
export function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_FIREBASE_CONFIG;
  } catch (e) {
    return DEFAULT_FIREBASE_CONFIG;
  }
}

/**
 * Save Firebase config
 */
export function saveFirebaseConfig(config) {
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Test Firebase Connection using Firestore REST API
 */
export async function testFirebaseConnection(config) {
  if (!config || !config.projectId) {
    throw new Error('দয়া করে Firebase Project ID প্রদান করুন');
  }

  const endpoint = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
  const res = await fetch(endpoint, {
    method: 'GET'
  });

  if (res.status === 404) {
    throw new Error('Firebase প্রজেক্ট বা Firestore ডাটাবেজ পাওয়া যায়নি। ফায়ারবেস কনসোলে Firestore Database তৈরি করা আছে কিনা নিশ্চিত করুন।');
  }

  // 200 or 403 (rules requirement) indicates project exists
  if (res.status === 200 || res.status === 403) {
    return {
      status: 'success',
      message: 'Firebase Firestore প্রজেক্ট সফলভাবে সংযুক্ত হয়েছে!'
    };
  }

  throw new Error(`Firebase রেসপন্স কোড: ${res.status}`);
}

/**
 * Push full data snapshot to Firestore via REST API
 */
export async function syncAllToFirebase(config, payload) {
  if (!config || !config.projectId) {
    throw new Error('Firebase Project ID প্রয়োজন');
  }

  const projectId = config.projectId;
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/coaching_data`;

  // We save payload under coaching_data/main_snapshot
  const body = {
    fields: {
      updatedAt: { stringValue: new Date().toISOString() },
      studentsJson: { stringValue: JSON.stringify(payload.students || []) },
      batchesJson: { stringValue: JSON.stringify(payload.batches || []) },
      feesJson: { stringValue: JSON.stringify(payload.fees || []) },
      attendanceJson: { stringValue: JSON.stringify(payload.attendance || {}) }
    }
  };

  const res = await fetch(`${baseUrl}/main_snapshot`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firebase সেভ ত্রুটি (${res.status}): ${errText}`);
  }

  return { status: 'success', message: 'ডাটা সফলভাবে Firebase Firestore এ সংরক্ষিত হয়েছে!' };
}

/**
 * Pull full data from Firebase Firestore
 */
export async function fetchFromFirebase(config) {
  if (!config || !config.projectId) {
    throw new Error('Firebase Project ID প্রয়োজন');
  }

  const projectId = config.projectId;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/coaching_data/main_snapshot`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Firebase থেকে ডাটা রিড করা যায়নি (${res.status})`);
  }

  const doc = await res.json();
  const fields = doc.fields || {};

  return {
    status: 'success',
    students: fields.studentsJson ? JSON.parse(fields.studentsJson.stringValue) : [],
    batches: fields.batchesJson ? JSON.parse(fields.batchesJson.stringValue) : [],
    fees: fields.feesJson ? JSON.parse(fields.feesJson.stringValue) : [],
    attendance: fields.attendanceJson ? JSON.parse(fields.attendanceJson.stringValue) : {}
  };
}
