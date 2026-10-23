import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  CreditCard,
  History,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export const SmsManagement = () => {
  const {
    smsLogs,
    smsBalance,
    students,
    batches,
    sendSms,
    t
  } = useApp();

  const [targetType, setTargetType] = useState('batch'); // 'all', 'batch', 'dues', 'custom'
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [customPhone, setCustomPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('attendance');
  const [messageBody, setMessageBody] = useState(
    'Edtech Manager: প্রিয় অভিভাবক, আপনার সন্তান আজ ক্লাসে অনুপস্থিত ছিল। ক্লাসে নিয়মিত উপস্থিতি কাম্য।'
  );
  const [sendSuccessNotice, setSendSuccessNotice] = useState(false);

  // Template change handler
  const handleTemplateChange = (tmpl) => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'attendance') {
      setMessageBody('Edtech Manager: প্রিয় অভিভাবক, আপনার সন্তান আজ ক্লাসে অনুপস্থিত ছিল। ক্লাসে নিয়মিত উপস্থিতি কাম্য।');
    } else if (tmpl === 'due') {
      setMessageBody('Edtech Manager: সম্মানিত অভিভাবক, আপনার সন্তানের চলতি মাসের কোচিং ফি বাবদ বেতন বকেয়া রয়েছে। দ্রুত পরিশোধের অনুরোধ রইল।');
    } else if (tmpl === 'exam') {
      setMessageBody('Edtech Manager: আগামী সোমবার মাসিক মডেল টেস্ট অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে নির্ধারিত সময়ে উপস্থিত হতে বলা হচ্ছে।');
    } else if (tmpl === 'holiday') {
      setMessageBody('Edtech Manager: পবিত্র শবে বরাত উপলক্ষে আগামীকাল কোচিং এর সকল ক্লাস বন্ধ থাকবে। পরশুদিন থেকে যথারীতি ক্লাস চলবে।');
    } else {
      setMessageBody('');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('দয়া করে এসএমএস এর বডি লিখুন');
      return;
    }

    let recipientDesc = '';
    let count = 1;

    if (targetType === 'all') {
      recipientDesc = `সকল শিক্ষার্থী (${students.length} জন)`;
      count = students.length;
    } else if (targetType === 'batch') {
      const b = batches.find(item => item.id === selectedBatchId);
      recipientDesc = `ব্যাচ: ${b ? b.name : 'ব্যাচ'} (${b ? b.enrolledCount : 0} জন)`;
      count = b ? b.enrolledCount : 1;
    } else if (targetType === 'dues') {
      const duesCount = students.filter(s => Number(s.dueAmount) > 0).length;
      recipientDesc = `বকেয়া শিক্ষার্থী (${duesCount} জন)`;
      count = duesCount || 1;
    } else {
      recipientDesc = customPhone || '01712-XXXXXX';
      count = 1;
    }

    sendSms({
      recipient: recipientDesc,
      type: selectedTemplate === 'due' ? 'বকেয়া তাগাদা' : selectedTemplate === 'attendance' ? 'হাজিরা নোটিশ' : 'সাধারণ নোটিশ',
      message: messageBody,
      cost: `৳ ${(count * 0.40).toFixed(2)}`
    });

    setSendSuccessNotice(true);
    setTimeout(() => setSendSuccessNotice(false), 3500);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('smsTitle')}</h1>
          <p>{t('smsSubtitle')}</p>
        </div>
      </div>

      {sendSuccessNotice && (
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
          এসএমএস সফলভাবে সেন্ডিং কিউতে যুক্ত হয়েছে এবং প্রাপকদের ফোনে পৌঁছে যাচ্ছে!
        </div>
      )}

      {/* SMS Metrics Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">{t('smsCurrentBalance')}</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <Zap size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--primary-600)' }}>{smsBalance} টি</div>
          <div className="stat-trend positive">নন-মাস্কিং ও দ্রুত ডেলিভারি</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">মোট প্রেরিত এসএমএস</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--success-bg)', color: 'var(--success-600)' }}>
              <Send size={18} />
            </div>
          </div>
          <div className="stat-value">১,২৮৫ টি</div>
          <div className="stat-trend positive">ডেলিভারি রেট ৯৯.৪%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">এসএমএস রেট</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--info-bg)', color: 'var(--info-600)' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="stat-value">৳ ০.৪০ / SMS</div>
          <div className="stat-trend">বাংলা ও ইংরেজি উভয় সাপোর্টেড</div>
        </div>
      </div>

      {/* Compose Form & Quick Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Compose Panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <MessageSquare size={18} color="var(--primary-500)" />
              এসএমএস পাঠান (Compose SMS)
            </span>
          </div>

          <form onSubmit={handleSend}>
            {/* Target Selection */}
            <div className="form-group">
              <label className="form-label">{t('targetAudience')} *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${targetType === 'batch' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTargetType('batch')}
                >
                  নির্দিষ্ট ব্যাচ
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${targetType === 'dues' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTargetType('dues')}
                >
                  বকেয়া শিক্ষার্থী
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${targetType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTargetType('all')}
                >
                  সকল শিক্ষার্থী
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${targetType === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTargetType('custom')}
                >
                  কাস্টম নম্বর
                </button>
              </div>
            </div>

            {targetType === 'batch' && (
              <div className="form-group">
                <label className="form-label">ব্যাচ নির্বাচন করুন</label>
                <select
                  className="form-control"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.enrolledCount} জন শিক্ষার্থী)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'custom' && (
              <div className="form-group">
                <label className="form-label">মোবাইল নম্বর লিখুন</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="017XXXXXXXX"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Template Selector Buttons */}
            <div className="form-group">
              <label className="form-label">{t('smsTemplate')}</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedTemplate === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTemplateChange('attendance')}
                >
                  {t('templateAttendance')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedTemplate === 'due' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTemplateChange('due')}
                >
                  {t('templateDueFee')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedTemplate === 'exam' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTemplateChange('exam')}
                >
                  {t('templateExamNotice')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedTemplate === 'holiday' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTemplateChange('holiday')}
                >
                  {t('templateHoliday')}
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>{t('smsMessageText')} *</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {messageBody.length} অক্ষর • ১টি SMS
                </span>
              </div>
              <textarea
                rows="4"
                className="form-control"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Send size={18} />
              {t('btnSendSmsNow')}
            </button>
          </form>
        </div>

        {/* SMS Recharge Packages & Sender ID preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SMS Sender ID Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Sparkles size={18} color="var(--primary-500)" />
                এসএমএস গেটওয়ে ও প্রেরক তথ্য
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
              <div>সেন্ডার আইডি: <strong>Edtech Manager</strong> (অনুমোদিত)</div>
              <div>গেটওয়ে স্ট্যাটাস: <span className="status-pill active">সক্রিয় ও লাইভ</span></div>
              <div>মাস্কিং টাইপ: <strong>নন-মাস্কিং ও বাল্ক ব্রডকাস্ট</strong></div>
              <div>অটো এসএমএস: <strong>হাজিরা ও ফি রসিদ ইন্টিগ্রেটেড</strong></div>
            </div>
          </div>

          {/* SMS Recharge Pricing Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <CreditCard size={18} color="var(--success-500)" />
                এসএমএস রিচার্জ প্যাকেজসমূহ
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'স্টার্টার প্যাক', sms: '১,০০০ SMS', price: '৳ ৪০০', perSms: '৪০ পয়সা' },
                { name: 'পপুলার প্যাক', sms: '৩,০০০ SMS', price: '৳ ১,১০০', perSms: '৩৬ পয়সা' },
                { name: 'মেগা প্যাক', sms: '১০,০০০ SMS', price: '৳ ৩,৫০০', perSms: '৩৫ পয়সা' }
              ].map((pack, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pack.name} ({pack.sms})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>রেট: {pack.perSms}/মেসেজ</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => alert(`${pack.name} রিচার্জ পেমেন্ট গেটওয়েতে পাঠানো হচ্ছে`)}
                  >
                    কিনুন {pack.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SMS Logs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '16px 20px', marginBottom: 0 }}>
          <span className="card-title">
            <History size={18} color="var(--primary-500)" />
            সাম্প্রতিক এসএমএস প্রেরণের বিবরণ (SMS Outbox)
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>আইডি</th>
                <th>প্রাপক</th>
                <th>মেসেজ টাইপ</th>
                <th>বার্তা (Message Body)</th>
                <th>তারিখ ও সময়</th>
                <th>খরচ</th>
                <th style={{ textAlign: 'center' }}>ডেলিভারি স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {smsLogs.map((log, i) => (
                <tr key={i}>
                  <td><strong>{log.id}</strong></td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{log.recipient}</span>
                  </td>
                  <td>
                    <span className="status-pill info">{log.type}</span>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.82rem' }}>
                    {log.message}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {log.date}
                  </td>
                  <td><strong>{log.cost}</strong></td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="status-pill active">
                      <CheckCircle size={12} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
