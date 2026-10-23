import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Plus,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
  X,
  Printer,
  ChevronRight
} from 'lucide-react';

export const ExamManagement = () => {
  const {
    exams,
    batches,
    students,
    addExam,
    updateExamMarks,
    t
  } = useApp();

  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [activeExamForMarks, setActiveExamForMarks] = useState(null);
  const [activeExamForResults, setActiveExamForResults] = useState(null);

  useEffect(() => {
    if (activeExamForResults) {
      document.body.classList.add('has-print-modal');
    } else {
      document.body.classList.remove('has-print-modal');
    }
  }, [activeExamForResults]);

  // New Exam Form
  const [newExam, setNewExam] = useState({
    title: '',
    batchId: batches[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    totalMarks: 50,
    passMarks: 20
  });

  // Marks entry state: studentId -> number
  const [marksState, setMarksState] = useState({});

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newExam.title) {
      alert('দয়া করে পরীক্ষার নাম লিখুন');
      return;
    }
    const b = batches.find(item => item.id === newExam.batchId);
    addExam({
      ...newExam,
      batchName: b ? b.name : 'ব্যাচ'
    });
    setIsNewExamModalOpen(false);
    setNewExam({
      title: '',
      batchId: batches[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      totalMarks: 50,
      passMarks: 20
    });
  };

  const openMarksEntry = (exam) => {
    setActiveExamForMarks(exam);
    const existing = {};
    if (exam.results && exam.results.length > 0) {
      exam.results.forEach(r => {
        existing[r.studentId] = r.marks;
      });
    }
    setMarksState(existing);
  };

  const calculateGrade = (marks, total) => {
    const pct = (marks / total) * 100;
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'A-';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    if (pct >= 33) return 'D';
    return 'F';
  };

  const handleSaveMarks = () => {
    if (!activeExamForMarks) return;
    const batchStds = students.filter(s => s.batchId === activeExamForMarks.batchId);

    // Build results list
    const results = batchStds.map(std => {
      const marks = Number(marksState[std.id] || 0);
      return {
        studentId: std.id,
        studentName: std.name,
        roll: std.roll,
        marks,
        grade: calculateGrade(marks, activeExamForMarks.totalMarks)
      };
    });

    // Sort descending by marks for ranking
    results.sort((a, b) => b.marks - a.marks);
    results.forEach((r, idx) => {
      r.position = idx + 1;
    });

    updateExamMarks(activeExamForMarks.id, results);
    setActiveExamForMarks(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('examsTitle')}</h1>
          <p>{t('examsSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewExamModalOpen(true)}>
            <Plus size={16} />
            <span>{t('btnNewExam')}</span>
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {exams.map(exam => {
          const resultsCount = exam.results?.length || 0;

          return (
            <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <span className="status-pill info" style={{ marginBottom: '6px' }}>
                    {exam.batchName}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '4px' }}>
                    {exam.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    তারিখ: {exam.date}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', margin: '14px 0', fontSize: '0.88rem' }}>
                <div>
                  পূর্ণমান: <strong style={{ color: 'var(--primary-600)' }}>{exam.totalMarks}</strong>
                </div>
                <div>
                  পাস মার্ক: <strong>{exam.passMarks}</strong>
                </div>
                <div>
                  ফলাফল এন্ট্রি: <strong>{resultsCount > 0 ? `${resultsCount} জন` : 'বাকি আছে'}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => openMarksEntry(exam)}
                >
                  <FileSpreadsheet size={15} />
                  {t('btnInputMarks')}
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setActiveExamForResults(exam)}
                >
                  <Award size={15} />
                  {t('btnViewResults')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Exam */}
      {isNewExamModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>
                <Award size={20} color="var(--primary-500)" />
                {t('btnNewExam')}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsNewExamModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExam}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('colExamName')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ অধ্যায় ৪ সাপ্তাহিক মূল্যায়ন পরীক্ষা"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">পরীক্ষার ব্যাচ *</label>
                  <select
                    className="form-control"
                    value={newExam.batchId}
                    onChange={(e) => setNewExam({ ...newExam, batchId: e.target.value })}
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.className})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">তারিখ</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newExam.date}
                      onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">পূর্ণমান *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newExam.totalMarks}
                      onChange={(e) => setNewExam({ ...newExam, totalMarks: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">পাস মার্ক</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newExam.passMarks}
                      onChange={(e) => setNewExam({ ...newExam, passMarks: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNewExamModalOpen(false)}
                >
                  {t('btnCancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  পরীক্ষা তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Input Marks Grid */}
      {activeExamForMarks && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{activeExamForMarks.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ব্যাচ: {activeExamForMarks.batchName} • পূর্ণমান: {activeExamForMarks.totalMarks}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveExamForMarks(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: 0, maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>রোল</th>
                      <th>শিক্ষার্থীর নাম</th>
                      <th style={{ width: '150px' }}>প্রাপ্ত নম্বর ({activeExamForMarks.totalMarks})</th>
                      <th>আনুমানিক গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(s => s.batchId === activeExamForMarks.batchId)
                      .map(std => {
                        const m = marksState[std.id] ?? '';
                        const grade = m !== '' ? calculateGrade(Number(m), activeExamForMarks.totalMarks) : '-';

                        return (
                          <tr key={std.id}>
                            <td><strong>#{std.roll}</strong></td>
                            <td>
                              <strong>{std.name}</strong>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{std.id}</div>
                            </td>
                            <td>
                              <input
                                type="number"
                                max={activeExamForMarks.totalMarks}
                                min={0}
                                className="form-control"
                                style={{ width: '100px', fontWeight: 800 }}
                                value={m}
                                onChange={(e) =>
                                  setMarksState({ ...marksState, [std.id]: e.target.value })
                                }
                                placeholder="নম্বর লিখুন"
                              />
                            </td>
                            <td>
                              <span className={`status-pill ${grade === 'F' ? 'inactive' : 'active'}`}>
                                {grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActiveExamForMarks(null)}>
                বাতিল
              </button>
              <button className="btn btn-primary" onClick={handleSaveMarks}>
                <CheckCircle size={16} />
                নম্বর সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Results / Merit List */}
      {activeExamForResults && (
        <div className="modal-backdrop print-modal-backdrop">
          <div className="modal-content print-modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>ফলাফল ও মেধা তালিকা (Merit List)</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeExamForResults.title} • পূর্ণমান: {activeExamForResults.totalMarks}
                </div>
              </div>
              <button className="modal-close-btn no-print" onClick={() => setActiveExamForResults(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px', textAlign: 'center' }}>মেধাক্রম</th>
                      <th>রোল</th>
                      <th>নাম</th>
                      <th>প্রাপ্ত নম্বর</th>
                      <th>শতকরা (%)</th>
                      <th>গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!activeExamForResults.results || activeExamForResults.results.length === 0) ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          এখনও কোনো নম্বর এন্ট্রি করা হয়নি
                        </td>
                      </tr>
                    ) : (
                      activeExamForResults.results.map((res, i) => {
                        const pct = Math.round((res.marks / activeExamForResults.totalMarks) * 100);

                        return (
                          <tr key={i}>
                            <td style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: i === 0 ? '#FEF3C7' : i === 1 ? '#E0E7FF' : 'var(--bg-subtle)',
                                  color: i === 0 ? '#92400E' : i === 1 ? '#3730A3' : 'var(--text-secondary)',
                                  fontWeight: 800,
                                  fontSize: '0.8rem'
                                }}
                              >
                                {res.position}
                              </span>
                            </td>
                            <td><strong>#{res.roll}</strong></td>
                            <td><strong>{res.studentName}</strong></td>
                            <td>
                              <strong style={{ color: 'var(--primary-600)' }}>
                                {res.marks} / {activeExamForResults.totalMarks}
                              </strong>
                            </td>
                            <td>{pct}%</td>
                            <td>
                              <span className={`status-pill ${res.grade === 'F' ? 'inactive' : 'active'}`}>
                                {res.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer no-print">
              <button className="btn btn-secondary" onClick={() => setActiveExamForResults(null)}>
                বন্ধ করুন
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} />
                মেধা তালিকা প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
