import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Layers,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Clock,
  Printer,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Dashboard = () => {
  const {
    students,
    batches,
    feeRecords,
    smsBalance,
    t,
    setActiveTab,
    setIsAddStudentModalOpen,
    setIsFeeCounterOpen,
    setReceiptToPrint
  } = useApp();

  // Calculations
  const totalCollectedAmount = feeRecords.reduce((sum, r) => sum + Number(r.paidAmount || 0), 0);
  const totalDueAmount = students.reduce((sum, s) => sum + Number(s.dueAmount || 0), 0);
  const avgAttendance = 94.5;

  const statCards = [
    {
      title: t('totalStudents'),
      value: `${students.length} জন`,
      trend: '+12% এই মাসে',
      isPositive: true,
      icon: Users,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.12)',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
    },
    {
      title: t('activeBatches'),
      value: `${batches.length}টি ব্যাচ`,
      trend: '৫টি ক্লাসরুম',
      isPositive: true,
      icon: Layers,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.12)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
    },
    {
      title: t('todayAttendance'),
      value: `${avgAttendance}%`,
      trend: 'আজকের গড় উপস্থিতি',
      isPositive: true,
      icon: CalendarCheck,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    {
      title: t('totalCollected'),
      value: `৳ ${totalCollectedAmount.toLocaleString('bn-BD')}`,
      trend: 'চলতি মাসে আদায়',
      isPositive: true,
      icon: CreditCard,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.12)',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
    },
    {
      title: t('dueAmount'),
      value: `৳ ${totalDueAmount.toLocaleString('bn-BD')}`,
      trend: 'বকেয়া তাগাদা দিন',
      isPositive: false,
      icon: AlertCircle,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)'
    },
    {
      title: t('smsBalance'),
      value: `${smsBalance} টি`,
      trend: 'নন-মাস্কিং বাল্ক',
      isPositive: true,
      icon: MessageSquare,
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.12)',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <span>Edtech Manager অ্যাডমিন ড্যাশবোর্ড</span>
            <Sparkles size={22} color="#F59E0B" />
          </h1>
          <p>কোচিং সেন্টারের দৈনন্দিন কার্যক্রম, আয়-ব্যয় এবং ক্লাসের সামগ্রিক চিত্র</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddStudentModalOpen(true)}>
            <UserPlus size={16} />
            <span>{t('actionNewAdmission')}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setIsFeeCounterOpen(true)}>
            <CreditCard size={16} />
            <span>{t('actionCollectFee')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card" style={{ '--accent-gradient': stat.gradient }}>
              <div className="stat-header">
                <span className="stat-label">{stat.title}</span>
                <div className="stat-icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-trend ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                <span>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Monthly Collection SVG Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <TrendingUp size={18} color="var(--primary-500)" />
              {t('monthlyCollectionChart')} (২০২৬)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>গত ৪ মাস</span>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 15px 0' }}>
            {[
              { month: 'ডিসেম্বর', amount: 48000, height: '45%' },
              { month: 'জানুয়ারি', amount: 65000, height: '62%' },
              { month: 'ফেব্রুয়ারি', amount: 78000, height: '78%' },
              { month: 'মার্চ (বর্তমান)', amount: 96500, height: '95%' }
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                  ৳{bar.amount.toLocaleString('bn-BD')}
                </span>
                <div
                  style={{
                    width: '45px',
                    height: bar.height,
                    background: i === 3 ? 'var(--primary-gradient)' : 'var(--bg-subtle)',
                    borderRadius: '8px 8px 0 0',
                    border: '1px solid var(--border-light)',
                    transition: 'all 0.3s ease',
                    boxShadow: i === 3 ? 'var(--shadow-purple)' : 'none'
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Trends */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <CalendarCheck size={18} color="var(--success-500)" />
              {t('attendanceTrendChart')}
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => setActiveTab('attendance')}>
              হাজিরা দিন <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '20px 0' }}>
            {/* Circular representation */}
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg width="130" height="130" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg-subtle)"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeDasharray="94.5, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>94.5%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>উপস্থিতি</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
                <span>উপস্থিত: <strong>৯৪.৫% (৭৬ জন)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                <span>অনুপস্থিত: <strong>৩.৫% (৩ জন)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>বিলম্ব: <strong>২.০% (২ জন)</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Schedule + Recent Fee Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Clock size={18} color="var(--primary-500)" />
              {t('todaySchedule')}
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => setActiveTab('batches')}>
              সব ব্যাচ <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {batches.slice(0, 3).map((b, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    👨‍🏫 {b.teacher} • 🏢 {b.room}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                    {b.schedule}
                  </div>
                  <span className="status-pill info" style={{ marginTop: '4px' }}>
                    ভর্তি: {b.enrolledCount}/{b.seatLimit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fee Transactions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <CreditCard size={18} color="var(--success-500)" />
              {t('recentPayments')}
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => setActiveTab('fees')}>
              সব লেনদেন <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {feeRecords.slice(0, 4).map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {rec.studentName} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(রোল {rec.roll})</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {rec.receiptNo} • {rec.month} • {rec.method}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--success-600)', fontSize: '0.95rem' }}>
                      ৳{Number(rec.paidAmount).toLocaleString('bn-BD')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rec.date}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '6px' }}
                    onClick={() => setReceiptToPrint(rec)}
                    title="রসিদ প্রিন্ট করুন"
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
