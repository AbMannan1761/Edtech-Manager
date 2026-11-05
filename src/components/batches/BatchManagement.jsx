import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Users,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  MessageSquare,
  CheckCircle,
  X,
  BookOpen,
  Trash2,
  Archive,
  ArchiveRestore,
  AlertTriangle,
  Search,
  AlertCircle
} from 'lucide-react';

export const BatchManagement = () => {
  const {
    batches,
    addBatch,
    deleteBatch,
    toggleArchiveBatch,
    students,
    t,
    language,
    setActiveTab
  } = useApp();

  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [selectedBatchForRoster, setSelectedBatchForRoster] = useState(null);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [batchToArchive, setBatchToArchive] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const activeCount = useMemo(() => batches.filter(b => b.status !== 'archived').length, [batches]);
  const archivedCount = useMemo(() => batches.filter(b => b.status === 'archived').length, [batches]);

  // Filtered batches list
  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      // Status filter
      if (filterStatus === 'active' && b.status === 'archived') return false;
      if (filterStatus === 'archived' && b.status !== 'archived') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (b.name || '').toLowerCase().includes(query);
        const matchesSubject = (b.subject || '').toLowerCase().includes(query);
        const matchesTeacher = (b.teacher || '').toLowerCase().includes(query);
        const matchesClass = (b.className || '').toLowerCase().includes(query);
        return matchesName || matchesSubject || matchesTeacher || matchesClass;
      }
      return true;
    });
  }, [batches, filterStatus, searchQuery]);

  // New Batch Form State
  const [newBatch, setNewBatch] = useState({
    name: '',
    className: 'HSC 2026',
    subject: '',
    teacher: '',
    schedule: '',
    room: 'রুম নং ১০১',
    seatLimit: 30,
    monthlyFee: 1500
  });

  const handleCreateBatch = (e) => {
    e.preventDefault();
    if (!newBatch.name || !newBatch.subject || !newBatch.teacher) {
      alert('দয়া করে ব্যাচের নাম, বিষয় এবং শিক্ষকের নাম লিখুন');
      return;
    }
    addBatch(newBatch);
    setIsNewBatchModalOpen(false);
    setNewBatch({
      name: '',
      className: 'HSC 2026',
      subject: '',
      teacher: '',
      schedule: '',
      room: 'রুম নং ১০১',
      seatLimit: 30,
      monthlyFee: 1500
    });
  };

  const handleConfirmDelete = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete.id);
      setBatchToDelete(null);
    }
  };

  const handleConfirmArchive = () => {
    if (batchToArchive) {
      toggleArchiveBatch(batchToArchive.id);
      setBatchToArchive(null);
    }
  };

  const rosterStudents = selectedBatchForRoster
    ? students.filter(s => s.batchId === selectedBatchForRoster.id)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('batchesTitle')}</h1>
          <p>{t('batchesSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewBatchModalOpen(true)}>
            <Plus size={16} />
            <span>{t('btnCreateBatch')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div className="batch-filter-pills">
          <button
            type="button"
            className={`batch-filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            {t('allBatchesFilter')} ({batches.length})
          </button>
          <button
            type="button"
            className={`batch-filter-pill ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            {t('activeBatchesFilter')} ({activeCount})
          </button>
          <button
            type="button"
            className={`batch-filter-pill ${filterStatus === 'archived' ? 'active' : ''}`}
            onClick={() => setFilterStatus('archived')}
          >
            {t('archivedBatchesFilter')} ({archivedCount})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            placeholder={language === 'bn' ? 'ব্যাচের নাম বা বিষয় খুঁজুন...' : 'Search batch or subject...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Layers size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {filterStatus === 'archived'
              ? (language === 'bn' ? 'কোনো আর্কাইভকৃত ব্যাচ নেই' : 'No archived batches found')
              : (language === 'bn' ? 'কোনো ব্যাচ পাওয়া যায়নি' : 'No batches found')}
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            {searchQuery
              ? (language === 'bn' ? 'অনুসন্ধান ফিল্টারে কোনো ফলাফল মেলেনি।' : 'No matches for your search term.')
              : (language === 'bn' ? 'নতুন ব্যাচ তৈরি করতে উপরের "নতুন ব্যাচ তৈরি" বাটনে ক্লিক করুন।' : 'Click the button above to create a new batch.')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {filteredBatches.map(batch => {
            const isArchived = batch.status === 'archived';
            const isFull = batch.enrolledCount >= batch.seatLimit;
            const percentage = Math.min(100, Math.round((batch.enrolledCount / batch.seatLimit) * 100));

            return (
              <div
                key={batch.id}
                className={`card ${isArchived ? 'batch-card-archived' : ''}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isArchived ? 'var(--text-muted)' : 'var(--primary-600)', textTransform: 'uppercase' }}>
                      {batch.className}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>{batch.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📖 বিষয়: <strong>{batch.subject}</strong>
                    </div>
                  </div>

                  {/* Actions & Status badge in Top-Right Corner */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => setBatchToArchive(batch)}
                        title={isArchived ? (language === 'bn' ? 'পুনরুদ্ধার / সক্রিয় করুন' : 'Restore Batch') : (language === 'bn' ? 'আর্কাইভ করুন' : 'Archive Batch')}
                        style={{
                          color: isArchived ? 'var(--success-500)' : 'var(--text-muted)'
                        }}
                      >
                        {isArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        onClick={() => setBatchToDelete(batch)}
                        title={language === 'bn' ? 'ব্যাচ ডিলিট করুন' : 'Delete Batch'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {isArchived ? (
                      <span className="status-pill archived">
                        📦 {t('batchStatusArchived')}
                      </span>
                    ) : (
                      <span className={`status-pill ${isFull ? 'inactive' : 'active'}`}>
                        {isFull ? t('batchStatusFull') : t('batchStatusOpen')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Batch Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--text-muted)" />
                    <span>শিক্ষক: <strong>{batch.teacher}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--text-muted)" />
                    <span>শিডিউল: <strong>{batch.schedule}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="var(--text-muted)" />
                    <span>ক্লাসরুম: <strong>{batch.room}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} color="var(--text-muted)" />
                    <span>মাসিক ফি: <strong>৳{batch.monthlyFee} / শিক্ষার্থী</strong></span>
                  </div>
                </div>

                {/* Seat Capacity Bar */}
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>আসন পূরণ:</span>
                    <span style={{ fontWeight: 700 }}>
                      {batch.enrolledCount} / {batch.seatLimit} শিক্ষার্থী ({percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: isArchived
                          ? '#94a3b8'
                          : percentage > 90
                          ? 'var(--danger-500)'
                          : 'var(--primary-gradient)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>

                  {/* Batch Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setSelectedBatchForRoster(batch)}
                    >
                      শিক্ষার্থী তালিকা ({batch.enrolledCount})
                    </button>
                    {!isArchived && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setActiveTab('attendance')}
                        title="হাজিরা দিন"
                      >
                        হাজিরা
                      </button>
                    )}
                    {isArchived && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setBatchToArchive(batch)}
                        title="পুনরায় সক্রিয় করুন"
                      >
                        <ArchiveRestore size={14} />
                        পুনরুদ্ধার
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Delete Batch Confirmation */}
      {batchToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-500)' }}>
                <AlertTriangle size={20} />
                {t('deleteBatchConfirmTitle')}
              </h3>
              <button className="modal-close-btn" onClick={() => setBatchToDelete(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.95rem', marginBottom: '14px', lineHeight: 1.5 }}>
                আপনি কি নিশ্চিত যে <strong>"{batchToDelete.name}"</strong> ব্যাচটি সম্পূর্ণ ডিলিট করতে চান?
              </p>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                <div>📚 শ্রেণি ও বিষয়: <strong>{batchToDelete.className} - {batchToDelete.subject}</strong></div>
                <div style={{ marginTop: '4px' }}>👨‍🏫 শিক্ষক: <strong>{batchToDelete.teacher}</strong></div>
                <div style={{ marginTop: '4px' }}>👥 ভর্তিকৃত শিক্ষার্থী: <strong>{batchToDelete.enrolledCount} জন</strong></div>
              </div>

              {batchToDelete.enrolledCount > 0 ? (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 14px', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', fontSize: '0.84rem', lineHeight: 1.45, marginBottom: '12px' }}>
                  <strong>⚠️ সতর্কতা:</strong> এই ব্যাচে বর্তমানে <strong>{batchToDelete.enrolledCount} জন শিক্ষার্থী</strong> রয়েছে। ব্যাচটি ডিলিট করলে শিক্ষার্থীদের প্রোফাইল থেকে এই ব্যাচটি অবমুক্ত হয়ে যাবে।
                  <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
                    💡 আপনি চাইলে ডিলিট না করে ব্যাচটিকে <strong>আর্কাইভ</strong> করতে পারেন যাতে শিক্ষার্থীদের কোনো রেকর্ড নষ্ট না হয়।
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  এই ব্যাচে কোনো শিক্ষার্থী নেই। ডিলিট করলে এটি সম্পূর্ণ মুছে যাবে।
                </p>
              )}
            </div>

            <div className="modal-footer" style={{ gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setBatchToDelete(null)}
              >
                {t('btnCancel')}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                {t('deleteBatch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Archive / Restore Confirmation */}
      {batchToArchive && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {batchToArchive.status === 'archived' ? (
                  <>
                    <ArchiveRestore size={20} color="var(--success-500)" />
                    ব্যাচ পুনঃসক্রিয়করণ
                  </>
                ) : (
                  <>
                    <Archive size={20} color="var(--warning-500)" />
                    {t('archiveBatchConfirmTitle')}
                  </>
                )}
              </h3>
              <button className="modal-close-btn" onClick={() => setBatchToArchive(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {batchToArchive.status === 'archived' ? (
                <div>
                  <p style={{ fontSize: '0.95rem', marginBottom: '12px', lineHeight: 1.5 }}>
                    আপনি কি <strong>"{batchToArchive.name}"</strong> ব্যাচটি পুনরায় সক্রিয় করতে চান?
                  </p>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    সক্রিয় করলে এই ব্যাচটি পুনরায় নিয়মিত রানিং ব্যাচ হিসেবে তালিকায় এবং দৈনিক হাজিরাতে অন্তর্ভুক্ত হবে।
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.95rem', marginBottom: '12px', lineHeight: 1.5 }}>
                    আপনি কি <strong>"{batchToArchive.name}"</strong> ব্যাচটি আর্কাইভ করতে চান?
                  </p>
                  <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    📦 আর্কাইভ করা ব্যাচের কোনো ডাটা বা শিক্ষার্থীর হিস্ট্রি মুছে যায় না। এটি শুধু রানিং তালিকা ও দৈনিক হাজিরা থেকে লুকানো থাকবে। আপনি যেকোনো সময় আবার সক্রিয় করতে পারবেন।
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setBatchToArchive(null)}
              >
                {t('btnCancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmArchive}
              >
                {batchToArchive.status === 'archived' ? (
                  <>
                    <ArchiveRestore size={16} />
                    পুনরুদ্ধার করুন
                  </>
                ) : (
                  <>
                    <Archive size={16} />
                    {t('archiveBatch')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Batch */}
      {isNewBatchModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>
                <Layers size={20} color="var(--primary-500)" />
                {t('btnCreateBatch')}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsNewBatchModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('colBatchName')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ এইচএসসি পদার্থবিজ্ঞান মিশন A+"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colClass')}</label>
                    <select
                      className="form-control"
                      value={newBatch.className}
                      onChange={(e) => setNewBatch({ ...newBatch, className: e.target.value })}
                    >
                      <option value="HSC 2026">HSC 2026</option>
                      <option value="SSC 2026">SSC 2026</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('colSubject')} *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ পদার্থবিজ্ঞান ১ম ও ২য় পত্র"
                      value={newBatch.subject}
                      onChange={(e) => setNewBatch({ ...newBatch, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colTeacher')} *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ তানভীর আহমেদ স্যার"
                      value={newBatch.teacher}
                      onChange={(e) => setNewBatch({ ...newBatch, teacher: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ক্লাসরুম</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ রুম ২০২"
                      value={newBatch.room}
                      onChange={(e) => setNewBatch({ ...newBatch, room: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('colTimeSlot')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ শনি-সোম-বুধ (বিকাল ৫:০০ - ৬:৩০)"
                    value={newBatch.schedule}
                    onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colSeatLimit')}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBatch.seatLimit}
                      onChange={(e) => setNewBatch({ ...newBatch, seatLimit: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">মাসিক ফি (৳)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBatch.monthlyFee}
                      onChange={(e) => setNewBatch({ ...newBatch, monthlyFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNewBatchModalOpen(false)}
                >
                  {t('btnCancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  ব্যাচ যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Batch Roster View */}
      {selectedBatchForRoster && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{selectedBatchForRoster.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  শিক্ষক: {selectedBatchForRoster.teacher} • শিডিউল: {selectedBatchForRoster.schedule}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedBatchForRoster(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>রোল</th>
                      <th>নাম</th>
                      <th>ফোন</th>
                      <th>অভিভাবকের ফোন</th>
                      <th>মাসিক ফি</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          এই ব্যাচে এখনও কোনো শিক্ষার্থী ভর্তি হয়নি
                        </td>
                      </tr>
                    ) : (
                      rosterStudents.map(std => (
                        <tr key={std.id}>
                          <td><strong>#{std.roll}</strong></td>
                          <td><strong>{std.name}</strong></td>
                          <td>{std.phone}</td>
                          <td>{std.guardianPhone}</td>
                          <td>৳{std.monthlyFee}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedBatchForRoster(null)}>
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
