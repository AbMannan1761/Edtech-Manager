import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Save,
  Check,
  Shield,
  CreditCard,
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const SettingsView = () => {
  const { settings, setSettings, t, setIsRegisterModalOpen } = useApp();

  const [formData, setFormData] = useState({
    coachingName: settings.coachingName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    academicYear: settings.academicYear
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings({
      ...settings,
      ...formData
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('settingsTitle')}</h1>
          <p>{t('settingsSubtitle')}</p>
        </div>
      </div>

      {saveSuccess && (
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
          প্রতিষ্ঠান সেটিংস সফলভাবে আপডেট করা হয়েছে!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Profile Settings Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Building size={18} color="var(--primary-500)" />
              কোচিং সেন্টারের প্রোফাইল
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('coachingName')} *</label>
              <input
                type="text"
                className="form-control"
                value={formData.coachingName}
                onChange={(e) => setFormData({ ...formData, coachingName: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('coachingPhone')} *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('coachingEmail')}</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('coachingAddress')}</label>
              <textarea
                rows="2"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">সেশন / শিক্ষাবর্ষ</label>
              <input
                type="text"
                className="form-control"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              <Save size={16} />
              {t('btnSaveSettings')}
            </button>
          </form>
        </div>

        {/* Plan & Subscription Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <CreditCard size={18} color="var(--success-500)" />
                বর্তমান সাবস্ক্রিপশন ও প্ল্যান
              </span>
              <span className="status-pill active">সক্রিয়</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>চলমান প্ল্যান:</span>
                <strong>{settings.currentPlan}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>মেয়াদ শেষ:</span>
                <strong>৩১ ডিসেম্বর ২০২৬</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>সর্বোচ্চ শিক্ষার্থী সীমা:</span>
                <strong>২০০ জন</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>এসএমএস ফিচার:</span>
                <span className="status-pill active">অনুমোদিত</span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setIsRegisterModalOpen(true)}
              >
                <Sparkles size={16} />
                প্ল্যান আপগ্রেড বা রিনিউ করুন
              </button>
            </div>
          </div>

          {/* SMS Gateway Configurations */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <MessageSquare size={18} color="var(--primary-500)" />
                এসএমএস গেটওয়ে ইন্টিগ্রেশন
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
              <div>সেন্ডার আইডি: <strong>Edtech Manager</strong></div>
              <div>সার্ভিস প্রোভাইডার: <strong>Teletalk / SSL Wireless</strong></div>
              <div>ব্যালেন্স সতর্কতা লিমিট: <strong>৫০ SMS</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
