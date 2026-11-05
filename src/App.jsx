import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentManagement } from './components/students/StudentManagement';
import { StudentIdCardModal } from './components/students/StudentIdCardModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { BatchManagement } from './components/batches/BatchManagement';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { FeeCollection } from './components/fees/FeeCollection';
import { MoneyReceiptModal } from './components/fees/MoneyReceiptModal';
import { SmsManagement } from './components/sms/SmsManagement';
import { ExamManagement } from './components/exams/ExamManagement';
import { StaffManagement } from './components/staff/StaffManagement';
import { SettingsView } from './components/settings/SettingsView';
import { RegisterWizardModal } from './components/auth/RegisterWizardModal';
import { LoginModal } from './components/auth/LoginModal';

const MainLayout = () => {
  const { activeTab } = useApp();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />

        <main className="page-body">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'batches' && <BatchManagement />}
          {activeTab === 'attendance' && <AttendanceManagement />}
          {activeTab === 'fees' && <FeeCollection />}
          {activeTab === 'sms' && <SmsManagement />}
          {activeTab === 'exams' && <ExamManagement />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Portals */}
      <StudentIdCardModal />
      <StudentProfileModal />
      <MoneyReceiptModal />
      <RegisterWizardModal />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
