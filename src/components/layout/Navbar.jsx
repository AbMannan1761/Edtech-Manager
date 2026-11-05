import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  UserCheck,
  Building2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn
} from 'lucide-react';

export const Navbar = () => {
  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    currentRole,
    setCurrentRole,
    settings,
    t,
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    isLoggedIn,
    currentUser,
    students,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const dueStudentsCount = students.filter(s => Number(s.dueAmount) > 0).length;

  return (
    <header className="top-navbar">
      {/* Left side */}
      <div className="navbar-left">
        <button
          className="nav-icon-btn"
          style={{ display: 'none' }}
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        <div className="branch-badge">
          <span className="branch-dot" />
          <span>{settings.coachingName}</span>
          <span style={{ opacity: 0.6, fontSize: '0.78rem' }}>• {t('sessionYear')}</span>
        </div>

        <div className="global-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder={t('searchPlaceholder')} />
        </div>
      </div>

      {/* Right side controls */}
      <div className="navbar-right">
        {/* Registration Wizard Button (EduOne Style) */}
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setIsRegisterModalOpen(true)}
          style={{ gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>{t('registerCoaching')}</span>
        </button>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            className={`role-pill ${currentRole}`}
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            title="Switch User Role"
          >
            <UserCheck size={14} />
            <span>
              {currentRole === 'admin' && t('roleAdmin')}
              {currentRole === 'teacher' && t('roleTeacher')}
              {currentRole === 'student' && t('roleStudent')}
            </span>
            <ChevronDown size={12} />
          </button>

          {showRoleMenu && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '180px',
                padding: '8px',
                zIndex: 60,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('roleCurrent')}
              </div>
              <button
                className={`sidebar-nav-item ${currentRole === 'admin' ? 'active' : ''}`}
                style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                onClick={() => {
                  setCurrentRole('admin');
                  setShowRoleMenu(false);
                }}
              >
                👑 {t('roleAdmin')}
              </button>
              <button
                className={`sidebar-nav-item ${currentRole === 'teacher' ? 'active' : ''}`}
                style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                onClick={() => {
                  setCurrentRole('teacher');
                  setShowRoleMenu(false);
                }}
              >
                📚 {t('roleTeacher')}
              </button>
              <button
                className={`sidebar-nav-item ${currentRole === 'student' ? 'active' : ''}`}
                style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                onClick={() => {
                  setCurrentRole('student');
                  setShowRoleMenu(false);
                }}
              >
                🎓 {t('roleStudent')}
              </button>
            </div>
          )}
        </div>

        {/* Login Button (User requested location) */}
        <button
          className={`btn btn-sm ${isLoggedIn ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setIsLoginModalOpen(true)}
          title={isLoggedIn ? (language === 'bn' ? `লগইনকৃত: ${currentUser?.name || ''}` : `Logged in as: ${currentUser?.name || ''}`) : (language === 'bn' ? 'লগ ইন করুন' : 'Log In')}
          style={{
            gap: '6px',
            fontSize: '0.82rem',
            padding: '7px 14px'
          }}
        >
          <LogIn size={15} />
          <span>{t('login')}</span>
        </button>

        {/* Language Toggle (Bangla / English) */}
        <button
          className="nav-icon-btn"
          onClick={toggleLanguage}
          title="বাংলা / English"
          style={{ fontWeight: 700, fontSize: '0.82rem', width: 'auto', padding: '0 12px', gap: '6px' }}
        >
          <Globe size={16} />
          <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? t('themeLight') : t('themeDark')}
        >
          {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="nav-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title={t('notifications')}
          >
            <Bell size={18} />
            {dueStudentsCount > 0 && <span className="badge-counter">{dueStudentsCount}</span>}
          </button>

          {showNotifications && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                padding: '16px',
                zIndex: 60,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div className="card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
                <span className="card-title" style={{ fontSize: '0.95rem' }}>
                  <Bell size={16} color="var(--primary-500)" /> {t('notifications')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>নতুন ৩টি</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', padding: '8px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <AlertCircle size={16} color="var(--danger-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{dueStudentsCount} জন শিক্ষার্থীর বেতন বকেয়া রয়েছে</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>১০ মিনিট আগে</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', padding: '8px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <CheckCircle2 size={16} color="var(--success-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>আজকের এইচএসসি ব্যাচে ৯৬% উপস্থিতি সম্পন্ন</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>১ ঘণ্টা আগে</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
