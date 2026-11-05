import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogIn,
  LogOut,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Smartphone
} from 'lucide-react';

export const LoginModal = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isLoggedIn,
    currentUser,
    login,
    logout,
    language,
    t
  } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState('admin'); // 'admin' | 'teacher' | 'student'
  const [identifier, setIdentifier] = useState('admin@edtech.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');

  // Update default credentials based on role tab
  useEffect(() => {
    if (activeRoleTab === 'admin') {
      setIdentifier('admin@edtech.com');
      setPassword('123456');
    } else if (activeRoleTab === 'teacher') {
      setIdentifier('01811-998877');
      setPassword('teacher123');
    } else if (activeRoleTab === 'student') {
      setIdentifier('STD-2026-101');
      setPassword('student123');
    }
    setLoginMessage('');
  }, [activeRoleTab]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      alert(language === 'bn' ? 'দয়া করে ইউজারনেম ও পাসওয়ার্ড লিখুন' : 'Please enter credentials');
      return;
    }

    let userObj = {
      role: activeRoleTab,
      email: identifier.includes('@') ? identifier : `${activeRoleTab}@edtech.com`,
      phone: identifier.includes('@') ? '01711-223344' : identifier
    };

    if (activeRoleTab === 'admin') {
      userObj.name = 'জাহিদ হাসান';
      userObj.roleTitle = 'সুপার অ্যাডমিন';
      userObj.avatar = 'JH';
    } else if (activeRoleTab === 'teacher') {
      userObj.name = 'রফিকুল ইসলাম (বুয়েট)';
      userObj.roleTitle = 'সিনিয়র শিক্ষক (পদার্থবিজ্ঞান)';
      userObj.avatar = 'RI';
    } else {
      userObj.name = 'আবরার ফাইয়াজ';
      userObj.roleTitle = 'শিক্ষার্থী (রোল ১০১, HSC)';
      userObj.avatar = 'AF';
    }

    login(userObj);
    setLoginMessage(language === 'bn' ? 'সফলভাবে লগ ইন সম্পন্ন হয়েছে!' : 'Login successful!');
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setLoginMessage('');
    }, 700);
  };

  const handleQuickDemo = (role) => {
    let demoUser = {};
    if (role === 'admin') {
      demoUser = {
        name: 'জাহিদ হাসান',
        role: 'admin',
        roleTitle: 'সুপার অ্যাডমিন',
        email: 'admin@edtech.com',
        phone: '01711-223344',
        avatar: 'JH'
      };
    } else if (role === 'teacher') {
      demoUser = {
        name: 'তানভীর আহমেদ (ঢাবি)',
        role: 'teacher',
        roleTitle: 'গণিত শিক্ষক',
        email: 'tanvir@edtech.com',
        phone: '01811-334455',
        avatar: 'TA'
      };
    } else {
      demoUser = {
        name: 'আবরার ফাইয়াজ',
        role: 'student',
        roleTitle: 'শিক্ষার্থী (রোল ১০১, HSC 2026)',
        email: 'abrar@edtech.com',
        phone: '01911-556677',
        avatar: 'AF'
      };
    }

    login(demoUser);
    setLoginMessage(language === 'bn' ? `ডেমো ${demoUser.roleTitle} হিসেবে লগ ইন হয়েছে!` : `Logged in as ${role}!`);
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setLoginMessage('');
    }, 700);
  };

  const handleLogoutClick = () => {
    logout();
    setLoginMessage(language === 'bn' ? 'সফলভাবে লগ আউট হয়েছে।' : 'Logged out successfully.');
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setLoginMessage('');
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <LogIn size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>{t('loginTitle')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('loginSubtitle')}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setIsLoginModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Current Active Session Banner (if logged in) */}
        {isLoggedIn && (
          <div
            style={{
              margin: '16px 24px 0',
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('loggedInAs')}</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {currentUser?.name || 'জাহিদ হাসান'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-500)', fontWeight: 600 }}>
                {currentUser?.roleTitle || (currentUser?.role === 'admin' ? 'সুপার অ্যাডমিন' : currentUser?.role === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী')}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleLogoutClick}
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
            >
              <LogOut size={14} />
              {t('logout')}
            </button>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div style={{ padding: '16px 24px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              background: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              gap: '4px'
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${activeRoleTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                border: 'none',
                boxShadow: activeRoleTab === 'admin' ? 'var(--shadow-sm)' : 'none',
                fontSize: '0.82rem',
                padding: '7px 8px'
              }}
              onClick={() => setActiveRoleTab('admin')}
            >
              👑 {t('roleAdmin')}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeRoleTab === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                border: 'none',
                boxShadow: activeRoleTab === 'teacher' ? 'var(--shadow-sm)' : 'none',
                fontSize: '0.82rem',
                padding: '7px 8px'
              }}
              onClick={() => setActiveRoleTab('teacher')}
            >
              📚 {t('roleTeacher')}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeRoleTab === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                border: 'none',
                boxShadow: activeRoleTab === 'student' ? 'var(--shadow-sm)' : 'none',
                fontSize: '0.82rem',
                padding: '7px 8px'
              }}
              onClick={() => setActiveRoleTab('student')}
            >
              🎓 {t('roleStudent')}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '18px 24px' }}>
            {loginMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  marginBottom: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--success-500)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{loginMessage}</span>
              </div>
            )}

            {/* Identifier input */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {activeRoleTab === 'admin'
                    ? (language === 'bn' ? 'অ্যাডমিন ইমেইল বা ফোন' : 'Admin Email/Phone')
                    : activeRoleTab === 'teacher'
                    ? (language === 'bn' ? 'শিক্ষক ফোন নম্বর / আইডি' : 'Teacher Phone / ID')
                    : (language === 'bn' ? 'শিক্ষার্থী আইডি / ফোন' : 'Student ID / Phone')} *
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="admin@edtech.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {t('loginPassword')} *
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধারের জন্য প্রতিষ্ঠানের অ্যাডমিনের সাথে যোগাযোগ করুন অথবা ফোন করুন: ০১৭০০-০০০০০০' : 'Please contact your coaching administrator.');
                  }}
                  style={{ fontSize: '0.78rem', color: 'var(--primary-500)', textDecoration: 'none' }}
                >
                  {t('forgotPassword')}
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="rememberMeCheckbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="rememberMeCheckbox" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                {t('rememberMe')}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px', fontSize: '0.95rem' }}
            >
              <LogIn size={16} />
              {t('btnLoginSubmit')}
            </button>

            {/* Quick 1-Click Demo Logins */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
                {t('quickDemoLogin')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px' }}
                  onClick={() => handleQuickDemo('admin')}
                  title="অ্যাডমিন হিসেবে লগইন"
                >
                  👑 অ্যাডমিন
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px' }}
                  onClick={() => handleQuickDemo('teacher')}
                  title="শিক্ষক হিসেবে লগইন"
                >
                  👨‍🏫 শিক্ষক
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px' }}
                  onClick={() => handleQuickDemo('student')}
                  title="শিক্ষার্থী হিসেবে লগইন"
                >
                  🎓 শিক্ষার্থী
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

