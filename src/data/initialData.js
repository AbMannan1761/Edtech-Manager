export const initialBatches = [
  {
    id: "B-101",
    name: "এইচএসসি পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    nameEn: "HSC Physics Special Batch",
    className: "HSC 2026",
    subject: "পদার্থবিজ্ঞান ১ম ও ২য় পত্র",
    teacher: "রফিকুল ইসলাম (বুয়েট)",
    schedule: "শনি-সোম-বুধ (বিকাল ৪:০০ - ৫:৩০)",
    room: "রুম নং ২০২",
    seatLimit: 35,
    enrolledCount: 28,
    monthlyFee: 1500,
    status: "active"
  },
  {
    id: "B-102",
    name: "উচ্চতর গণিত মিশন A+",
    nameEn: "Higher Math Mission A+",
    className: "HSC 2026",
    subject: "উচ্চতর গণিত ১ম ও ২য় পত্র",
    teacher: "তানভীর আহমেদ (ঢাবি)",
    schedule: "রবি-মঙ্গল-বৃহস্পতি (বিকাল ৫:৩০ - ৭:০০)",
    room: "রুম নং ২০৫",
    seatLimit: 30,
    enrolledCount: 26,
    monthlyFee: 1800,
    status: "active"
  },
  {
    id: "B-103",
    name: "এসএসসি বিজ্ঞান মাস্টার ব্যাচ",
    nameEn: "SSC Science Master Batch",
    className: "SSC 2026",
    subject: "পদার্থ, রসায়ন ও জীববিজ্ঞান",
    teacher: "মাহমুদুল হাসান স্যার",
    schedule: "শনি-সোম-বুধ (সকাল ৯:০০ - ১০:৩০)",
    room: "রুম নং ১০১",
    seatLimit: 40,
    enrolledCount: 36,
    monthlyFee: 2200,
    status: "active"
  },
  {
    id: "B-104",
    name: "নবম শ্রেণি গণিত অলিম্পিয়াড ও সাধারণ গণিত",
    nameEn: "Class 9 Math Olympiad & General",
    className: "Class 9",
    subject: "সাধারণ গণিত",
    teacher: "নাজমুল হুদা স্যার",
    schedule: "রবি-মঙ্গল-বৃহস্পতি (বিকাল ৩:৩০ - ৫:০০)",
    room: "রুম নং ১০৩",
    seatLimit: 25,
    enrolledCount: 21,
    monthlyFee: 1200,
    status: "active"
  },
  {
    id: "B-105",
    name: "মেডিকেল রসায়ন ক্র্যাশ কোর্স",
    nameEn: "Medical Chemistry Crash Course",
    className: "Admission",
    subject: "রসায়ন (অর্গানিক স্পেশাল)",
    teacher: "ডা. আসিফ ইকবাল (ডিএমসি)",
    schedule: "প্রতিদিন (সকাল ১০:০০ - ১১:৩০)",
    room: "অডিটোরিয়াম",
    seatLimit: 50,
    enrolledCount: 48,
    monthlyFee: 3500,
    status: "active"
  }
];

export const initialStudents = [
  {
    id: "STD-2026-001",
    roll: "101",
    name: "আবরার ফাইয়াজ",
    nameEn: "Abrar Faiyaz",
    className: "HSC 2026",
    batchId: "B-101",
    batchName: "এইচএসসি পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    phone: "01712-345678",
    guardianName: "মো. কামরুল হাসান",
    guardianPhone: "01819-876543",
    address: "মিরপুর-১০, ঢাকা",
    monthlyFee: 1500,
    discount: 0,
    status: "active",
    admissionDate: "2026-01-10",
    attendanceRate: 96,
    dueAmount: 0
  },
  {
    id: "STD-2026-002",
    roll: "102",
    name: "নুসরাত জাহান মিম",
    nameEn: "Nusrat Jahan Mim",
    className: "HSC 2026",
    batchId: "B-101",
    batchName: "এইচএসসি পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    phone: "01911-223344",
    guardianName: "শাহেদ আলম",
    guardianPhone: "01722-334455",
    address: "ফার্মগেট, তেজগাঁও, ঢাকা",
    monthlyFee: 1500,
    discount: 200,
    status: "active",
    admissionDate: "2026-01-12",
    attendanceRate: 92,
    dueAmount: 1300
  },
  {
    id: "STD-2026-003",
    roll: "103",
    name: "সাদমান সাকিব",
    nameEn: "Sadman Sakib",
    className: "HSC 2026",
    batchId: "B-102",
    batchName: "উচ্চতর গণিত মিশন A+",
    phone: "01844-556677",
    guardianName: "মোস্তাফিজুর রহমান",
    guardianPhone: "01688-990011",
    address: "মোহাম্মদপুর, ঢাকা",
    monthlyFee: 1800,
    discount: 0,
    status: "active",
    admissionDate: "2026-01-15",
    attendanceRate: 88,
    dueAmount: 1800
  },
  {
    id: "STD-2026-004",
    roll: "201",
    name: "ফারিহা আনজুম",
    nameEn: "Fariha Anjum",
    className: "SSC 2026",
    batchId: "B-103",
    batchName: "এসএসসি বিজ্ঞান মাস্টার ব্যাচ",
    phone: "01755-667788",
    guardianName: "আহমেদ শরিফ",
    guardianPhone: "01933-445566",
    address: "উত্তরা সেক্টর ৭, ঢাকা",
    monthlyFee: 2200,
    discount: 200,
    status: "active",
    admissionDate: "2026-01-18",
    attendanceRate: 100,
    dueAmount: 0
  },
  {
    id: "STD-2026-005",
    roll: "202",
    name: "তানভীর হাসান শুভ",
    nameEn: "Tanvir Hasan Shuvo",
    className: "SSC 2026",
    batchId: "B-103",
    batchName: "এসএসসি বিজ্ঞান মাস্টার ব্যাচ",
    phone: "01521-112233",
    guardianName: "লুৎফর রহমান",
    guardianPhone: "01788-990022",
    address: "ধানমন্ডি ২৭, ঢাকা",
    monthlyFee: 2200,
    discount: 0,
    status: "active",
    admissionDate: "2026-01-20",
    attendanceRate: 85,
    dueAmount: 2200
  },
  {
    id: "STD-2026-006",
    roll: "301",
    name: "মাইশা তাসনিম",
    nameEn: "Maisha Tasnim",
    className: "Class 9",
    batchId: "B-104",
    batchName: "নবম শ্রেণি গণিত অলিম্পিয়াড ও সাধারণ গণিত",
    phone: "01744-889900",
    guardianName: "এ কে এম জহিরুল হক",
    guardianPhone: "01855-667788",
    address: "লালমাটিয়া, ঢাকা",
    monthlyFee: 1200,
    discount: 0,
    status: "active",
    admissionDate: "2026-02-01",
    attendanceRate: 95,
    dueAmount: 0
  },
  {
    id: "STD-2026-007",
    roll: "401",
    name: "তাহসিন উল হাসান",
    nameEn: "Tahsin Ul Hasan",
    className: "Admission",
    batchId: "B-105",
    batchName: "মেডিকেল রসায়ন ক্র্যাশ কোর্স",
    phone: "01999-887766",
    guardianName: "ড. আনোয়ার হোসেন",
    guardianPhone: "01711-223344",
    address: "শান্তিনগর, ঢাকা",
    monthlyFee: 3500,
    discount: 500,
    status: "active",
    admissionDate: "2026-02-10",
    attendanceRate: 98,
    dueAmount: 0
  }
];

export const initialFeeRecords = [
  {
    receiptNo: "REC-2026-1001",
    studentId: "STD-2026-001",
    studentName: "আবরার ফাইয়াজ",
    roll: "101",
    batchName: "এইচএসসি পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    month: "মার্চ ২০২৬",
    feeType: "মাসিক বেতন",
    amount: 1500,
    discount: 0,
    paidAmount: 1500,
    dueAmount: 0,
    method: "bKash (01712-345678)",
    date: "2026-03-05",
    collectedBy: "অ্যাডমিন (মোঃ জাহিদ)"
  },
  {
    receiptNo: "REC-2026-1002",
    studentId: "STD-2026-004",
    studentName: "ফারিহা আনজুম",
    roll: "201",
    batchName: "এসএসসি বিজ্ঞান মাস্টার ব্যাচ",
    month: "মার্চ ২০২৬",
    feeType: "মাসিক বেতন ও শিট ফি",
    amount: 2200,
    discount: 200,
    paidAmount: 2000,
    dueAmount: 0,
    method: "নগদ ক্যাশ",
    date: "2026-03-07",
    collectedBy: "অ্যাকাউন্টস অফিসার"
  },
  {
    receiptNo: "REC-2026-1003",
    studentId: "STD-2026-007",
    studentName: "তাহসিন উল হাসান",
    roll: "401",
    batchName: "মেডিকেল রসায়ন ক্র্যাশ কোর্স",
    month: "মার্চ ২০২৬",
    feeType: "ফুল কোর্স ফি (১ম কিস্তি)",
    amount: 3500,
    discount: 500,
    paidAmount: 3000,
    dueAmount: 0,
    method: "Nagad (01999-887766)",
    date: "2026-03-10",
    collectedBy: "অ্যাডমিন"
  }
];

export const initialAttendance = {
  "2026-03-14_B-101": {
    "STD-2026-001": "present",
    "STD-2026-002": "present"
  },
  "2026-03-14_B-103": {
    "STD-2026-004": "present",
    "STD-2026-005": "absent"
  }
};

export const initialSmsLogs = [
  {
    id: "SMS-501",
    recipient: "01788-990022 (তানভীর হাসান)",
    type: "হাজিরা অ্যালার্ট",
    message: "Edtech Manager: প্রিয় অভিভাবক, আপনার সন্তান তানভীর হাসান আজ (১৪/০৩/২৬) ক্লাসে অনুপস্থিত ছিল।",
    date: "2026-03-14 10:15 AM",
    status: "Delivered",
    cost: "৳ 0.40"
  },
  {
    id: "SMS-502",
    recipient: "01819-876543 (আবরার ফাইয়াজ)",
    type: "ফি প্রাপ্তি রসিদ",
    message: "Edtech Manager: আবরার ফাইয়াজ এর মার্চ মাসের ফি বাবদ ৳১৫০০ টাকা সফলভাবে জমা হয়েছে। রসিদ নং: REC-2026-1001। ধন্যবাদ।",
    date: "2026-03-05 02:30 PM",
    status: "Delivered",
    cost: "৳ 0.40"
  },
  {
    id: "SMS-503",
    recipient: "Batch: HSC 26 Physics (২৮ জন)",
    type: "ক্লাস শিডিউল",
    message: "Edtech Manager: আগামীকাল সোমবার এইচএসসি পদার্থবিজ্ঞান ক্লাসে চ্যাপ্টার ৩ এর উপর বিশেষ পরীক্ষা অনুষ্ঠিত হবে। সময় বিকাল ৪:০০।",
    date: "2026-03-12 06:00 PM",
    status: "Delivered",
    cost: "৳ 11.20"
  }
];

export const initialExams = [
  {
    id: "EX-101",
    title: "পদার্থবিজ্ঞান অধ্যায় ৩: গতিবিদ্যা মডেল টেস্ট",
    titleEn: "Physics Chapter 3: Dynamics Model Test",
    batchId: "B-101",
    batchName: "এইচএসসি পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    date: "2026-03-10",
    totalMarks: 50,
    passMarks: 25,
    results: [
      { studentId: "STD-2026-001", studentName: "আবরার ফাইয়াজ", roll: "101", marks: 46, grade: "A+", position: 1 },
      { studentId: "STD-2026-002", studentName: "নুসরাত জাহান মিম", roll: "102", marks: 41, grade: "A", position: 2 }
    ]
  },
  {
    id: "EX-102",
    title: "সাধারণ গণিত পরিমিতি ও ত্রিকোণমিতি সাপ্তাহিক টেস্ট",
    titleEn: "General Math Trigonometry Weekly Test",
    batchId: "B-103",
    batchName: "এসএসসি বিজ্ঞান মাস্টার ব্যাচ",
    date: "2026-03-12",
    totalMarks: 40,
    passMarks: 20,
    results: [
      { studentId: "STD-2026-004", studentName: "ফারিহা আনজুম", roll: "201", marks: 38, grade: "A+", position: 1 },
      { studentId: "STD-2026-005", studentName: "তানভীর হাসান শুভ", roll: "202", marks: 28, grade: "B", position: 2 }
    ]
  }
];

export const initialTeachers = [
  {
    id: "TCH-01",
    name: "রফিকুল ইসলাম",
    title: "লেকচারার (বুয়েট)",
    subject: "পদার্থবিজ্ঞান",
    phone: "01711-554433",
    batchesCount: 3,
    salary: 28000,
    joinDate: "2024-01-01"
  },
  {
    id: "TCH-02",
    name: "তানভীর আহমেদ",
    title: "মাস্টার্স (গণিত, ঢাবি)",
    subject: "উচ্চতর গণিত",
    phone: "01812-998877",
    batchesCount: 2,
    salary: 25000,
    joinDate: "2024-03-15"
  },
  {
    id: "TCH-03",
    name: "ডা. আসিফ ইকবাল",
    title: "এমবিবিএস (ঢাকা মেডিকেল কলেজ)",
    subject: "রসায়ন ও জীববিজ্ঞান",
    phone: "01913-665544",
    batchesCount: 2,
    salary: 35000,
    joinDate: "2024-06-01"
  }
];

export const initialSettings = {
  coachingName: "Edtech Manager একাডেমি ও কোচিং সেন্টার",
  coachingNameEn: "Edtech Manager Academy & Coaching Center",
  phone: "+880 1712-345678",
  email: "contact@edtechmanager.com",
  address: "বাড়ি নং ১২, রোড নং ৪, সেক্টর ৯, উত্তরা, ঢাকা - ১২৩০",
  established: "2020",
  currentPlan: "Standard Plan (৳৩০০/মাসিক)",
  smsBalance: 840,
  academicYear: "2026"
};
