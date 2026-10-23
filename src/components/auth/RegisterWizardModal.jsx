import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Building,
  User,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check
} from 'lucide-react';

export const RegisterWizardModal = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, setSettings, settings } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Coaching Info
  const [coachingData, setCoachingData] = useState({
    coachingName: '',
    phone: '',
    email: '',
    address: ''
  });

  // Step 2: Admin Info
  const [adminData, setAdminData] = useState({
    adminName: '',
    adminPhone: '',
    password: '',
    confirmPassword: ''
  });

  // Step 3: Subscription Plan
  const [selectedPlan, setSelectedPlan] = useState('trial');

  if (!isRegisterModalOpen) return null;

  const handleFinish = (e) => {
    e.preventDefault();
    if (coachingData.coachingName) {
      setSettings({
        ...settings,
        coachingName: coachingData.coachingName,
        phone: coachingData.phone || settings.phone,
        email: coachingData.email || settings.email,
        address: coachingData.address || settings.address,
        currentPlan: selectedPlan === 'trial'
          ? 'ফ্রি ট্রায়াল (১ মাস - ১০০ শিক্ষার্থী)'
          : selectedPlan === 'standard'
          ? 'Standard Plan (৳৩০০/মাসিক)'
          : selectedPlan === 'premium'
          ? 'Premium Plan (৳৫০০/মাসিক)'
          : 'Basic Plan (৳২০০/মাসিক)'
      });
    }

    alert('অভিনন্দন! আপনার Edtech Manager কোচিং প্ল্যাটফর্ম সফলভাবে নিবন্ধিত ও কনফিগার হয়েছে।');
    setIsRegisterModalOpen(false);
    setCurrentStep(1);
  };

  const plans = [
    {
      id: 'trial',
      name: 'ফ্রি ট্রায়াল',
      price: '৳ ০',
      period: '/১ মাস',
      badge: '১ মাস ফ্রি 🎁',
      students: '১০০ জন শিক্ষার্থী পর্যন্ত',
      features: ['১ মাস সম্পূর্ণ ফ্রি ট্রায়াল', '১০০ জন শিক্ষার্থী পর্যন্ত', 'দৈনিক হাজিরা শিট', 'ফি রসিদ ও আইডি কার্ড', 'আনলিমিটেড ব্যাচ তৈরি']
    },
    {
      id: 'basic',
      name: 'বেসিক প্ল্যান',
      price: '৳ ২০০',
      period: '/মাস',
      students: '৫০ জন শিক্ষার্থী পর্যন্ত',
      features: ['বেসিক ড্যাশবোর্ড', 'দৈনিক হাজিরা শিট', 'ফি রসিদ প্রিন্ট', '১ জন শিক্ষক']
    },
    {
      id: 'standard',
      name: 'স্ট্যান্ডার্ড প্ল্যান',
      price: '৳ ৩০০',
      period: '/মাস',
      badge: 'জনপ্রিয় 🚀',
      students: '২০০ জন শিক্ষার্থী পর্যন্ত',
      features: ['সকল বেসিক ফিচার', 'বাল্ক এসএমএস গেটওয়ে', 'ডিজিটাল আইডি কার্ড', 'আনলিমিটেড ব্যাচ', 'রেজাল্ট মেধা তালিকা']
    },
    {
      id: 'premium',
      name: 'প্রিমিয়াম প্ল্যান',
      price: '৳ ৫০০',
      period: '/মাস',
      students: '৫০০ জন শিক্ষার্থী পর্যন্ত',
      features: ['সব ফিচার অন্তর্ভুক্ত', 'কাস্টম ব্র্যান্ডিং ও লোগো', 'অ্যাকাউন্টিং রিপোর্ট', '২৪/৭ ফোন সাপোর্ট']
    }
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '860px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Sparkles size={16} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Edtech Manager কোচিং রেজিস্ট্রেশন ও অনবোর্ডিং</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsRegisterModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* 3-Step Wizard Navigation */}
        <div style={{ padding: '24px 28px 0' }}>
          <div className="step-wizard-nav">
            <div
              className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(1)}
            >
              <div className="step-circle">
                {currentStep > 1 ? <Check size={16} /> : '১'}
              </div>
              <span className="step-title">প্রতিষ্ঠানের তথ্য</span>
            </div>

            <div
              className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
              onClick={() => coachingData.coachingName && setCurrentStep(2)}
            >
              <div className="step-circle">
                {currentStep > 2 ? <Check size={16} /> : '২'}
              </div>
              <span className="step-title">অ্যাডমিন অ্যাকাউন্ট</span>
            </div>

            <div
              className={`step-item ${currentStep === 3 ? 'active' : ''}`}
              onClick={() => adminData.adminName && setCurrentStep(3)}
            >
              <div className="step-circle">৩</div>
              <span className="step-title">প্যাকেজ নির্বাচন</span>
            </div>
          </div>
        </div>

        <div className="modal-body" style={{ paddingTop: '10px' }}>
          {/* STEP 1: Coaching Profile */}
          {currentStep === 1 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                🏢 আপনার কোচিং সেন্টারের প্রাথমিক তথ্য দিন
              </h4>

              <div className="form-group">
                <label className="form-label">কোচিং সেন্টারের নাম *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="উদাঃ নলেজ পার্ক একাডেমিক কেয়ার"
                  value={coachingData.coachingName}
                  onChange={(e) => setCoachingData({ ...coachingData, coachingName: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">হটলাইন মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="01712-XXXXXX"
                    value={coachingData.phone}
                    onChange={(e) => setCoachingData({ ...coachingData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ইমেইল অ্যাড্রেস</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="coaching@domain.com"
                    value={coachingData.email}
                    onChange={(e) => setCoachingData({ ...coachingData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">শাখা ও পূর্ণাঙ্গ ঠিকানা</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="উদাঃ বাড়ি ১২, রোড ৫, উত্তরা, ঢাকা"
                  value={coachingData.address}
                  onChange={(e) => setCoachingData({ ...coachingData, address: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Admin Credentials */}
          {currentStep === 2 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                👑 সুপার অ্যাডমিন প্রোফাইল তৈরি করুন
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">অ্যাডমিনের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ ইঞ্জিনিয়ার জাহিদ হাসান"
                    value={adminData.adminName}
                    onChange={(e) => setAdminData({ ...adminData, adminName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ব্যক্তিগত মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="018XX-XXXXXX"
                    value={adminData.adminPhone}
                    onChange={(e) => setAdminData({ ...adminData, adminPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">পাসওয়ার্ড নির্ধারণ করুন *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                    value={adminData.confirmPassword}
                    onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--success-500)" />
                আপনার ডেটা সম্পূর্ণ এনক্রিপ্টেড এবং নিরাপদ থাকবে।
              </div>
            </div>
          )}

          {/* STEP 3: Plan Selector */}
          {currentStep === 3 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                🚀 আপনার কোচিং এর উপযোগী প্ল্যান নির্বাচন করুন
              </h4>

              <div className="plan-cards-grid">
                {plans.map(p => (
                  <div
                    key={p.id}
                    className={`plan-card-choice ${selectedPlan === p.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    {p.badge && <span className="plan-badge">{p.badge}</span>}
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{p.name}</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-600)' }}>
                      {p.price} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{p.period}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, margin: '8px 0', color: 'var(--text-secondary)' }}>
                      {p.students}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {p.features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Check size={12} color="#10B981" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Step navigation */}
        <div className="modal-footer">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft size={16} />
              পূর্ববর্তী
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (currentStep === 1 && !coachingData.coachingName) {
                  alert('দয়া করে কোচিং সেন্টারের নাম লিখুন');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              পরবর্তী ধাপ
              <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleFinish}>
              <CheckCircle2 size={16} />
              রেজিস্ট্রেশন ও চালু করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
