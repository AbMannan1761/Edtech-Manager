import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';
import {
  initialBatches,
  initialStudents,
  initialFeeRecords,
  initialAttendance,
  initialSmsLogs,
  initialExams,
  initialTeachers,
  initialSettings
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Localization: 'bn' (Bangla) or 'en' (English)
  const [language, setLanguage] = useState(() => localStorage.getItem('eduone_lang') || 'bn');

  // Theme: 'dark' or 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('eduone_theme') || 'dark');

  // Active Role: 'admin', 'teacher', 'student'
  const [currentRole, setCurrentRole] = useState('admin');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data State (synced with localStorage)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('eduone_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('eduone_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  const [feeRecords, setFeeRecords] = useState(() => {
    const saved = localStorage.getItem('eduone_fees');
    return saved ? JSON.parse(saved) : initialFeeRecords;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('eduone_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [smsLogs, setSmsLogs] = useState(() => {
    const saved = localStorage.getItem('eduone_sms');
    return saved ? JSON.parse(saved) : initialSmsLogs;
  });

  const [smsBalance, setSmsBalance] = useState(840);

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('eduone_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [teachers, setTeachers] = useState(initialTeachers);
  const [settings, setSettings] = useState(initialSettings);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isFeeCounterOpen, setIsFeeCounterOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [profileStudent, setProfileStudent] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eduone_theme', theme);
  }, [theme]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('eduone_lang', language);
  }, [language]);

  // Sync storage
  useEffect(() => {
    localStorage.setItem('eduone_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('eduone_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('eduone_fees', JSON.stringify(feeRecords));
  }, [feeRecords]);

  useEffect(() => {
    localStorage.setItem('eduone_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    if (idCardStudent || receiptToPrint) {
      document.body.classList.add('has-print-modal');
    } else {
      document.body.classList.remove('has-print-modal');
    }
  }, [idCardStudent, receiptToPrint]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations['bn']?.[key] || key;
  };

  // Student Actions
  const addStudent = (studentData) => {
    const newId = `STD-2026-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent = {
      ...studentData,
      id: newId,
      status: 'active',
      admissionDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      dueAmount: Number(studentData.monthlyFee || 0) - Number(studentData.discount || 0)
    };

    setStudents(prev => [newStudent, ...prev]);

    // Update batch enrolled count
    if (studentData.batchId) {
      setBatches(prev =>
        prev.map(b => (b.id === studentData.batchId ? { ...b, enrolledCount: b.enrolledCount + 1 } : b))
      );
    }
    return newStudent;
  };

  const deleteStudent = (id) => {
    const target = students.find(s => s.id === id);
    if (target && target.batchId) {
      setBatches(prev =>
        prev.map(b => (b.id === target.batchId ? { ...b, enrolledCount: Math.max(0, b.enrolledCount - 1) } : b))
      );
    }
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Batch Actions
  const addBatch = (batchData) => {
    const newId = `B-${100 + batches.length + 1}`;
    const newBatch = {
      ...batchData,
      id: newId,
      enrolledCount: 0,
      status: 'active'
    };
    setBatches(prev => [...prev, newBatch]);
    return newBatch;
  };

  // Fee Collection Actions
  const addFeeRecord = (record) => {
    const receiptNo = `REC-2026-${1000 + feeRecords.length + 1}`;
    const newRecord = {
      ...record,
      receiptNo,
      date: new Date().toISOString().split('T')[0],
      collectedBy: currentRole === 'admin' ? 'অ্যাডমিন' : 'অফিসার'
    };
    setFeeRecords(prev => [newRecord, ...prev]);

    // Deduct student due
    setStudents(prev =>
      prev.map(s => {
        if (s.id === record.studentId) {
          const currentDue = Number(s.dueAmount || 0);
          const paid = Number(record.paidAmount || 0);
          return { ...s, dueAmount: Math.max(0, currentDue - paid) };
        }
        return s;
      })
    );

    // Auto trigger SMS confirmation
    if (record.phone) {
      sendSms({
        recipient: `${record.phone} (${record.studentName})`,
        type: language === 'bn' ? 'ফি রসিদ' : 'Fee Receipt',
        message: `Edtech Manager: ${record.studentName} এর ${record.month} ফি ৳${record.paidAmount} টাকা সফলভাবে জমা হয়েছে। রসিদ: ${receiptNo}। ধন্যবাদ।`,
        cost: '৳ 0.40'
      });
    }

    return newRecord;
  };

  // Attendance Actions
  const saveAttendanceBatch = (dateKey, batchId, statusMap) => {
    const key = `${dateKey}_${batchId}`;
    setAttendance(prev => ({
      ...prev,
      [key]: statusMap
    }));
  };

  // SMS Actions
  const sendSms = (smsPayload) => {
    const newId = `SMS-${500 + smsLogs.length + 1}`;
    const dateStr = new Date().toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newLog = {
      id: newId,
      ...smsPayload,
      date: dateStr,
      status: 'Delivered'
    };

    setSmsLogs(prev => [newLog, ...prev]);
    setSmsBalance(prev => Math.max(0, prev - 1));
  };

  // Exam Actions
  const addExam = (examData) => {
    const newId = `EX-${100 + exams.length + 1}`;
    const newExam = {
      id: newId,
      ...examData,
      results: []
    };
    setExams(prev => [newExam, ...prev]);
  };

  const updateExamMarks = (examId, studentMarksList) => {
    setExams(prev =>
      prev.map(ex => (ex.id === examId ? { ...ex, results: studentMarksList } : ex))
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        t,
        students,
        batches,
        feeRecords,
        attendance,
        smsLogs,
        smsBalance,
        exams,
        teachers,
        settings,
        setSettings,
        addStudent,
        deleteStudent,
        addBatch,
        addFeeRecord,
        saveAttendanceBatch,
        sendSms,
        addExam,
        updateExamMarks,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        isFeeCounterOpen,
        setIsFeeCounterOpen,
        receiptToPrint,
        setReceiptToPrint,
        idCardStudent,
        setIdCardStudent,
        profileStudent,
        setProfileStudent,
        mobileSidebarOpen,
        setMobileSidebarOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
