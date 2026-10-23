import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, BookOpen, ShieldCheck } from 'lucide-react';

export const StudentIdCardModal = () => {
  const { idCardStudent, setIdCardStudent, settings } = useApp();

  if (!idCardStudent) return null;

  return (
    <div className="modal-backdrop print-modal-backdrop">
      <div className="modal-content print-modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header no-print">
          <h3>
            <BookOpen size={20} color="var(--primary-500)" />
            শিক্ষার্থী ডিজিটাল আইডি কার্ড
          </h3>
          <button className="modal-close-btn" onClick={() => setIdCardStudent(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          {/* Printable ID Card Container */}
          <div
            id="student-id-card"
            style={{
              width: '320px',
              height: '480px',
              background: 'linear-gradient(180deg, #4F46E5 0%, #312E81 100%)',
              borderRadius: '16px',
              boxShadow: '0 20px 30px rgba(79, 70, 229, 0.35)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 16px',
              border: '2px solid rgba(255,255,255,0.15)'
            }}
          >
            {/* Background pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)',
                pointerEvents: 'none'
              }}
            />

            {/* Institution Header */}
            <div style={{ textAlign: 'center', marginBottom: '14px', zIndex: 2 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                {settings.coachingName}
              </div>
              <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>স্টুডেন্ট আইডেন্টিটি কার্ড</div>
            </div>

            {/* Photo Avatar Frame */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                border: '3px solid #818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#4F46E5',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 2
              }}
            >
              {idCardStudent.name.slice(0, 2)}
            </div>

            {/* Student Info */}
            <div style={{ textAlign: 'center', zIndex: 2, marginBottom: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{idCardStudent.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#C7D2FE', fontWeight: 600 }}>
                {idCardStudent.className} • রোল #{idCardStudent.roll}
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                lineHeight: '1.6',
                zIndex: 2,
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>আইডি নং:</span>
                <span style={{ fontWeight: 700 }}>{idCardStudent.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>ব্যাচ:</span>
                <span style={{ fontWeight: 700 }}>{idCardStudent.batchName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>মোবাইল:</span>
                <span style={{ fontWeight: 700 }}>{idCardStudent.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>অভিভাবক:</span>
                <span style={{ fontWeight: 700 }}>{idCardStudent.guardianPhone}</span>
              </div>
            </div>

            {/* Barcode Graphic */}
            <div
              style={{
                marginTop: 'auto',
                width: '100%',
                background: 'white',
                borderRadius: '6px',
                padding: '6px 12px',
                textAlign: 'center',
                zIndex: 2
              }}
            >
              <div
                style={{
                  height: '24px',
                  letterSpacing: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#111827',
                  fontWeight: 900
                }}
              >
                |||| | ||||| ||| |||||
              </div>
              <div style={{ fontSize: '0.62rem', color: '#6B7280' }}>
                বৈধতার মেয়াদ: ৩১ ডিসেম্বর ২০২৬
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={() => setIdCardStudent(null)}>
            বন্ধ করুন
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            আইডি কার্ড প্রিন্ট করুন
          </button>
        </div>
      </div>
    </div>
  );
};
