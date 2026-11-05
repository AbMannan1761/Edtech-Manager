import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Award,
  GraduationCap,
  Settings,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    batches,
    smsBalance,
    t,
    currentRole,
    settings,
    currentUser,
    isLoggedIn,
    setIsLoginModalOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'students',
      label: t('navStudents'),
      icon: Users,
      badge: students.length
    },
    {
      id: 'batches',
      label: t('navBatches'),
      icon: Layers,
      badge: batches.filter(b => b.status !== 'archived').length
    },
    {
      id: 'attendance',
      label: t('navAttendance'),
      icon: CalendarCheck,
      badge: null
    },
    {
      id: 'fees',
      label: t('navFees'),
      icon: CreditCard,
      badge: null
    },
    {
      id: 'sms',
      label: t('navSms'),
      icon: MessageSquare,
      badge: `${smsBalance}`
    },
    {
      id: 'exams',
      label: t('navExams'),
      icon: Award,
      badge: null
    },
    {
      id: 'staff',
      label: t('navStaff'),
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              Edtech <span>Manager</span>
            </span>
            <span className="brand-subtitle">{t('brandTagline')}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-menu">
        <div className="menu-category-title">ম্যানেজমেন্ট মেনু</div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
            >
              <div className="nav-link-content">
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="nav-pill-badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer Profile Box */}
      <div className="sidebar-footer">
        <div
          className="user-profile-widget"
          onClick={() => setIsLoginModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="লগইন অ্যাকাউন্ট পরিবর্তন বা পরিচালনা করুন"
        >
          <div className="avatar-circle">
            {currentUser?.avatar || (currentRole === 'admin' ? 'এড' : currentRole === 'teacher' ? 'টি' : 'শি')}
          </div>
          <div className="user-info">
            <span className="user-name">
              {currentUser?.name || (currentRole === 'admin'
                ? 'জাহিদ হাসান (অ্যাডমিন)'
                : currentRole === 'teacher'
                ? 'রফিকুল ইসলাম স্যার'
                : 'আবরার ফাইয়াজ (রোল ১০১)')}
            </span>
            <span className="user-role-sub">
              {currentUser?.roleTitle || (currentRole === 'admin' ? 'সুপার অ্যাডমিন' : currentRole === 'teacher' ? 'ফ্যাকাল্টি' : 'বিজ্ঞান বিভাগ')}
            </span>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      </div>
    </aside>
  );
};
