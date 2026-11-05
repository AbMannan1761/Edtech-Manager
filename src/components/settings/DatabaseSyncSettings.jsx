import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Sheet,
  Flame,
  Cloud,
  RefreshCw,
  Check,
  AlertCircle,
  Copy,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  HardDrive,
  Sparkles,
  Info
} from 'lucide-react';
import {
  GOOGLE_SHEET_STORAGE_KEY,
  GOOGLE_SHEET_AUTOSYNC_KEY,
  APPS_SCRIPT_CODE,
  testGoogleSheetConnection,
  syncAllToGoogleSheet,
  fetchFromGoogleSheet
} from '../../services/googleSheetService';
import {
  FIREBASE_CONFIG_KEY,
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  testFirebaseConnection,
  syncAllToFirebase,
  fetchFromFirebase
} from '../../services/firebaseService';

export const DatabaseSyncSettings = () => {
  const {
    students,
    setStudents,
    batches,
    setBatches,
    feeRecords,
    setFeeRecords,
    attendance,
    setAttendance,
    language
  } = useApp();

  // Mode: 'local' | 'googlesheet' | 'firebase' | 'hybrid'
  const [dbMode, setDbMode] = useState(() => localStorage.getItem('eduone_db_mode') || 'hybrid');

  // Google Sheet state
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => localStorage.getItem(GOOGLE_SHEET_STORAGE_KEY) || '');
  const [googleAutoSync, setGoogleAutoSync] = useState(() => localStorage.getItem(GOOGLE_SHEET_AUTOSYNC_KEY) === 'true');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Firebase state
  const [firebaseConfig, setFirebaseConfig] = useState(getStoredFirebaseConfig);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }

  // Save mode changes
  useEffect(() => {
    localStorage.setItem('eduone_db_mode', dbMode);
  }, [dbMode]);

  const handleSaveGoogleSheetUrl = (e) => {
    e.preventDefault();
    localStorage.setItem(GOOGLE_SHEET_STORAGE_KEY, googleSheetUrl.trim());
    localStorage.setItem(GOOGLE_SHEET_AUTOSYNC_KEY, googleAutoSync ? 'true' : 'false');
    setStatusMsg({
      type: 'success',
      text: language === 'bn' ? 'গুগল শীট সংযোগ তথ্য সংরক্ষিত হয়েছে!' : 'Google Sheet settings saved!'
    });
  };

  const handleTestGoogleSheet = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      await testGoogleSheetConnection(googleSheetUrl.trim());
      setStatusMsg({
        type: 'success',
        text: language === 'bn' ? '✅ গুগল শীটের সাথে সফলভাবে সংযোগ স্থাপিত হয়েছে!' : 'Connected to Google Sheet successfully!'
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: language === 'bn' ? `ত্রুটি: ${err.message}` : `Error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToGoogleSheet = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await syncAllToGoogleSheet(googleSheetUrl.trim(), {
        students,
        batches,
        fees: feeRecords,
        attendance
      });
      setStatusMsg({
        type: 'success',
        text: res.message || (language === 'bn' ? 'সকল ডাটা গুগল শীটে পাঠানো হয়েছে!' : 'Data synced to Google Sheet!')
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: language === 'bn' ? `সিঙ্ক ব্যর্থ: ${err.message}` : `Sync failed: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFromGoogleSheet = async () => {
    if (!window.confirm(language === 'bn' ? 'গুগল শীট থেকে ডাটা লোড করলে বর্তমান লোকাল ডাটা প্রতিস্থাপিত হবে। আপনি কি নিশ্চিত?' : 'Overwrite local data with Google Sheet data?')) {
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    try {
      const data = await fetchFromGoogleSheet(googleSheetUrl.trim());
      if (data.students && data.students.length > 0) setStudents(data.students);
      if (data.batches && data.batches.length > 0) setBatches(data.batches);
      if (data.fees && data.fees.length > 0) setFeeRecords(data.fees);
      if (data.attendance) setAttendance(data.attendance);

      setStatusMsg({
        type: 'success',
        text: language === 'bn' ? 'গুগল শীট থেকে সফলভাবে সকল ডাটা নিয়ে আসা হয়েছে!' : 'Successfully imported data from Google Sheet!'
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: language === 'bn' ? `ইমপোর্ট ত্রুটি: ${err.message}` : `Import failed: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    saveFirebaseConfig(firebaseConfig);
    setStatusMsg({
      type: 'success',
      text: language === 'bn' ? 'Firebase কনফিগারেশন সংরক্ষিত হয়েছে!' : 'Firebase config saved!'
    });
  };

  const handleTestFirebase = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      await testFirebaseConnection(firebaseConfig);
      setStatusMsg({
        type: 'success',
        text: language === 'bn' ? '✅ Firebase Firestore সফলভাবে কানেক্ট হয়েছে!' : 'Connected to Firebase successfully!'
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: language === 'bn' ? `ত্রুটি: ${err.message}` : `Error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToFirebase = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await syncAllToFirebase(firebaseConfig, {
        students,
        batches,
        fees: feeRecords,
        attendance
      });
      setStatusMsg({
        type: 'success',
        text: res.message || 'Firebase এ ডাটা সফলভাবে সংরক্ষিত হয়েছে!'
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `Firebase সিঙ্ক ত্রুটি: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div style={{ marginTop: '28px' }}>
      {/* Title */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={22} color="var(--primary-500)" />
          ক্লাউড ডাটাবেজ ও সিঙ্ক ম্যানেজমেন্ট (Database & Cloud Sync)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          আপনার পছন্দমতো গুগল শীট (Google Sheet) অথবা গুগল ফায়ারবেস (Firebase Firestore) ব্যাকএন্ড হিসেবে সংযুক্ত করুন।
        </p>
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600,
            background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: statusMsg.type === 'success' ? 'var(--success-500)' : 'var(--danger-500)'
          }}
        >
          {statusMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Database Mode Switcher */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <span className="card-title" style={{ fontSize: '1rem' }}>
            <HardDrive size={18} color="var(--primary-500)" />
            সক্রিয় ব্যাকএন্ড মোড (Active Backend Architecture)
          </span>
          <span className="status-pill active" style={{ textTransform: 'uppercase' }}>
            {dbMode}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Google Sheet */}
          <div
            onClick={() => setDbMode('googlesheet')}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${dbMode === 'googlesheet' ? 'var(--primary-500)' : 'var(--border-light)'}`,
              background: dbMode === 'googlesheet' ? 'var(--bg-subtle)' : 'var(--bg-card)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              ১. গুগল শীট (Google Sheet)
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              এক্সেলের মতো সরাসরি গুগল শীটে ডাটা দেখতে ও এডিট করতে উপযুক্ত।
            </p>
          </div>

          {/* Firebase Firestore */}
          <div
            onClick={() => setDbMode('firebase')}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${dbMode === 'firebase' ? 'var(--primary-500)' : 'var(--border-light)'}`,
              background: dbMode === 'firebase' ? 'var(--bg-subtle)' : 'var(--bg-card)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              ২. ফায়ারবেস (Firestore)
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              প্রফেশনাল, সুপার ফাস্ট ও রিয়েল-টাইম ক্লাউড ডাটাবেজ (Google Cloud)।
            </p>
          </div>

          {/* Hybrid Mode */}
          <div
            onClick={() => setDbMode('hybrid')}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${dbMode === 'hybrid' ? 'var(--primary-500)' : 'var(--border-light)'}`,
              background: dbMode === 'hybrid' ? 'var(--bg-subtle)' : 'var(--bg-card)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              <Sparkles size={18} color="var(--primary-500)" />
              ৩. হাইব্রিড (১ ও ২ একসাথে)
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              একই সাথে গুগল শীট এবং ফায়ারবেস দুটোতেই ব্যাকআপ ও সিঙ্ক হবে!
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Google Sheet Config & Firebase Config */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* OPTION 1: Google Sheet Integration Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <span className="card-title">
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              ১. গুগল শীট ব্যাকএন্ড সেটিংস (Google Sheet API)
            </span>
            <span className={`status-pill ${googleSheetUrl ? 'active' : 'inactive'}`}>
              {googleSheetUrl ? 'সংযুক্ত' : 'অসংযুক্ত'}
            </span>
          </div>

          <form onSubmit={handleSaveGoogleSheetUrl}>
            <div className="form-group">
              <label className="form-label">Google Apps Script Web App URL *</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                আপনার গুগল শীটের Extensions &gt; Apps Script থেকে তৈরি করা Web App URL টি এখানে দিন।
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <input
                type="checkbox"
                id="googleAutoSyncCheckbox"
                checked={googleAutoSync}
                onChange={(e) => setGoogleAutoSync(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="googleAutoSyncCheckbox" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                অটো-সিঙ্ক চালু রাখুন (Auto-sync changes to Google Sheet)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={loading}
              >
                URL সংরক্ষণ করুন
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleTestGoogleSheet}
                disabled={loading || !googleSheetUrl}
              >
                {loading ? <RefreshCw size={14} className="spin" /> : '🔗 কানেকশন টেস্ট'}
              </button>
            </div>
          </form>

          {/* Sync Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              ডাটা পুশ / পুল অপশন:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleSyncToGoogleSheet}
                disabled={loading || !googleSheetUrl}
                title="লোকাল ডাটা গুগল শীটে পাঠান"
              >
                <Upload size={14} />
                শীটে ব্যাকআপ পাঠান
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleFetchFromGoogleSheet}
                disabled={loading || !googleSheetUrl}
                title="গুগল শীট থেকে ডাটা আনুন"
              >
                <Download size={14} />
                শীট থেকে ডাটা আনুন
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setShowScriptModal(!showScriptModal)}
                style={{ marginLeft: 'auto', color: 'var(--primary-500)' }}
              >
                Apps Script কোড দেখুন {showScriptModal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* OPTION 2: Firebase Firestore Integration Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <span className="card-title">
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              ২. গুগল ফায়ারবেস ব্যাকএন্ড (Firebase Firestore)
            </span>
            <span className={`status-pill ${firebaseConfig.projectId ? 'active' : 'inactive'}`}>
              {firebaseConfig.projectId ? 'সংযুক্ত' : 'অসংযুক্ত'}
            </span>
          </div>

          <form onSubmit={handleSaveFirebaseConfig}>
            <div className="form-group">
              <label className="form-label">Firebase Project ID *</label>
              <input
                type="text"
                className="form-control"
                placeholder="edtech-manager-coaching"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Firebase Console এ আপনার প্রজেক্টের ID লিখুন।
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Web API Key (ঐচ্ছিক)</label>
              <input
                type="text"
                className="form-control"
                placeholder="AIzaSy..."
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={loading}
              >
                কনফিগ সংরক্ষণ
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleTestFirebase}
                disabled={loading || !firebaseConfig.projectId}
              >
                {loading ? <RefreshCw size={14} className="spin" /> : '🔗 কানেকশন টেস্ট'}
              </button>
            </div>
          </form>

          {/* Firebase Sync Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              ফায়ারবেস ডাটা সিঙ্ক:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleSyncToFirebase}
                disabled={loading || !firebaseConfig.projectId}
              >
                <Upload size={14} />
                ফায়ারবেসে ব্যাকআপ পাঠান
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={async () => {
                  if (!window.confirm('ফায়ারবেস থেকে ডাটা আনলে বর্তমান লোকাল ডাটা প্রতিস্থাপিত হবে। নিশ্চিত?')) return;
                  setLoading(true);
                  try {
                    const data = await fetchFromFirebase(firebaseConfig);
                    if (data.students?.length) setStudents(data.students);
                    if (data.batches?.length) setBatches(data.batches);
                    if (data.fees?.length) setFeeRecords(data.fees);
                    if (data.attendance) setAttendance(data.attendance);
                    setStatusMsg({ type: 'success', text: 'ফায়ারবেস থেকে ডাটা সফলভাবে রিসিভ করা হয়েছে!' });
                  } catch (e) {
                    setStatusMsg({ type: 'error', text: e.message });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !firebaseConfig.projectId}
              >
                <Download size={14} />
                ফায়ারবেস থেকে ডাটা আনুন
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Apps Script Setup Code Modal / Box */}
      {showScriptModal && (
        <div className="card" style={{ marginTop: '24px', border: '1px solid var(--primary-500)' }}>
          <div className="card-header">
            <span className="card-title">
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              গুগল শীটে পেস্ট করার জন্য Apps Script কোড (Google Apps Script Code)
            </span>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleCopyCode}
              style={{ gap: '6px' }}
            >
              {copiedCode ? <CheckCheck size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
            </button>
          </div>

          <div style={{ padding: '0 0 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>কিভাবে করবেন (৪ সহজ ধাপ):</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.6 }}>
              <li>যেকোনো ব্রাউজারে একটি নতুন <strong>Google Sheet</strong> খুলুন।</li>
              <li>শীটের উপরের মেনু থেকে <strong>Extensions &gt; Apps Script</strong> এ ক্লিক করুন।</li>
              <li>আগের সব কোড ডিলিট করে নিচের কোডটি হুবহু পেস্ট করুন এবং <strong>Save</strong> আইকনে চাপুন।</li>
              <li>ডানপাশে <strong>Deploy &gt; New deployment</strong> &gt; সিলেক্ট করুন <strong>Web app</strong> &gt; Who has access: <strong>Anyone</strong> দিয়ে Deploy করে Web App URL টি কপি করে উপরে বসিয়ে দিন।</li>
            </ol>
          </div>

          <pre
            style={{
              background: 'var(--bg-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              maxHeight: '300px',
              overflowY: 'auto',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              fontFamily: 'monospace'
            }}
          >
            {APPS_SCRIPT_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
