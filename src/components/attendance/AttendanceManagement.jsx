import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Save,
  Users,
  Check,
  AlertCircle
} from 'lucide-react';

export const AttendanceManagement = () => {
  const {
    students,
    batches,
    attendance,
    saveAttendanceBatch,
    sendSms,
    t
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [autoSmsOnAbsent, setAutoSmsOnAbsent] = useState(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Local status map for active date & batch
  const currentKey = `${selectedDate}_${selectedBatchId}`;
  const [statusMap, setStatusMap] = useState({});

  // Filter students belonging to this batch
  const batchStudents = students.filter(s => s.batchId === selectedBatchId);

  useEffect(() => {
    // Load existing or set all present
    const existing = attendance[currentKey];
    if (existing) {
      setStatusMap(existing);
    } else {
      const defaultMap = {};
      batchStudents.forEach(s => {
        defaultMap[s.id] = 'present';
      });
      setStatusMap(defaultMap);
    }
  }, [currentKey, selectedBatchId]);

  const handleStatusChange = (studentId, status) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    batchStudents.forEach(s => {
      updated[s.id] = 'present';
    });
    setStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    saveAttendanceBatch(selectedDate, selectedBatchId, statusMap);

    // If auto SMS enabled, trigger SMS for absentees
    if (autoSmsOnAbsent) {
      const currentBatch = batches.find(b => b.id === selectedBatchId);
      const batchName = currentBatch ? currentBatch.name : 'ব্যাচ';

      batchStudents.forEach(s => {
        if (statusMap[s.id] === 'absent') {
          sendSms({
            recipient: `${s.guardianPhone} (${s.name})`,
            type: 'অনুপস্থিতি অ্যালার্ট',
            message: `Edtech Manager: সম্মানিত অভিভাবক, আপনার সন্তান ${s.name} (রোল ${s.roll}) আজ ${selectedDate} তারিখে ${batchName} ক্লাসে অনুপস্থিত ছিল।`,
            cost: '৳ 0.40'
          });
        }
      });
    }

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Metrics
  const total = batchStudents.length;
  const presentCount = Object.values(statusMap).filter(v => v === 'present').length;
  const absentCount = Object.values(statusMap).filter(v => v === 'absent').length;
  const lateCount = Object.values(statusMap).filter(v => v === 'late').length;
  const presentRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('attendanceTitle')}</h1>
          <p>{t('attendanceSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleMarkAllPresent}>
            <CheckCircle2 size={16} />
            <span>{t('btnMarkAllPresent')}</span>
          </button>
          <button className="btn btn-primary" onClick={handleSaveAttendance}>
            <Save size={16} />
            <span>{t('btnSaveAttendance')}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            background: 'var(--success-bg)',
            color: 'var(--success-text)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600
          }}
        >
          <Check size={18} />
          হাজিরা সফলভাবে সংরক্ষিত হয়েছে এবং অনুপস্থিত অভিভাবকদের ফোনে এসএমএস পৌঁছে গেছে!
        </div>
      )}

      {/* Date & Batch Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '18px 20px' }}>
        <div className="filter-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('selectDate')}</label>
              <input
                type="date"
                className="form-control"
                style={{ width: '170px' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('selectBatch')}</label>
              <select
                className="form-control"
                style={{ minWidth: '260px' }}
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.schedule})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SMS Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={autoSmsOnAbsent}
              onChange={(e) => setAutoSmsOnAbsent(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>{t('smsOnAbsentAlert')}</span>
          </label>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">মোট শিক্ষার্থী</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{total} জন</div>
          <div className="stat-trend positive">ভর্তিকৃত শিক্ষার্থী</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">উপস্থিত</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--success-bg)', color: 'var(--success-600)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success-600)' }}>{presentCount} জন</div>
          <div className="stat-trend positive">উপস্থিতির হার {presentRate}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">অনুপস্থিত</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--danger-bg)', color: 'var(--danger-600)' }}>
              <XCircle size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--danger-600)' }}>{absentCount} জন</div>
          <div className="stat-trend negative">এসএমএস যাবে: {absentCount} টি</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">দেরিতে উপস্থিতি</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--warning-bg)', color: 'var(--warning-600)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning-600)' }}>{lateCount} জন</div>
          <div className="stat-trend">সময়মতো ক্লাসে আসার পরামর্শ</div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>রোল</th>
                <th>শিক্ষার্থীর নাম</th>
                <th>আইডি নং</th>
                <th>অভিভাবকের মোবাইল</th>
                <th style={{ textAlign: 'center' }}>হাজিরা স্ট্যাটাস নির্ধারণ</th>
              </tr>
            </thead>
            <tbody>
              {batchStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    এই ব্যাচে কোনো শিক্ষার্থী নিবন্ধিত নেই
                  </td>
                </tr>
              ) : (
                batchStudents.map(std => {
                  const status = statusMap[std.id] || 'present';

                  return (
                    <tr key={std.id}>
                      <td><strong>#{std.roll}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{std.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{std.phone}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                          {std.id}
                        </span>
                      </td>
                      <td>{std.guardianPhone}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${status === 'present' ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => handleStatusChange(std.id, 'present')}
                            style={{ minWidth: '90px' }}
                          >
                            <CheckCircle2 size={14} />
                            {t('present')}
                          </button>

                          <button
                            type="button"
                            className={`btn btn-sm ${status === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => handleStatusChange(std.id, 'absent')}
                            style={{ minWidth: '90px' }}
                          >
                            <XCircle size={14} />
                            {t('absent')}
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handleStatusChange(std.id, 'late')}
                            style={{
                              minWidth: '80px',
                              background: status === 'late' ? '#F59E0B' : 'var(--bg-card)',
                              color: status === 'late' ? 'white' : 'var(--text-primary)',
                              border: '1px solid var(--border-light)'
                            }}
                          >
                            <Clock size={14} />
                            {t('late')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
