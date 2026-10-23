import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle, BookOpen } from 'lucide-react';

export const MoneyReceiptModal = () => {
  const { receiptToPrint, setReceiptToPrint, settings, t } = useApp();

  if (!receiptToPrint) return null;

  return (
    <div className="modal-backdrop print-modal-backdrop">
      <div className="modal-content print-modal-content" style={{ maxWidth: '780px' }}>
        <div className="modal-header no-print">
          <h3>
            <BookOpen size={20} color="var(--primary-500)" />
            {t('receiptTitle')}
          </h3>
          <button className="modal-close-btn" onClick={() => setReceiptToPrint(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#F3F4F6', padding: '20px' }}>
          {/* Official Money Receipt Sheet */}
          <div className="money-receipt-sheet">
            {/* Header */}
            <div className="receipt-header">
              <div>
                <div className="receipt-brand-title">{settings.coachingName}</div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  {settings.address}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  ফোন: {settings.phone} • ইমেইল: {settings.email}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: '1px solid #C7D2FE',
                    marginBottom: '6px'
                  }}
                >
                  মানি রসিদ (MONEY RECEIPT)
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>
                  রসিদ নং: {receiptToPrint.receiptNo}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  তারিখ: {receiptToPrint.date}
                </div>
              </div>
            </div>

            {/* Student & Payment Metadata */}
            <div className="receipt-meta-grid">
              <div>
                <strong>শিক্ষার্থীর নাম:</strong> {receiptToPrint.studentName}
              </div>
              <div>
                <strong>রোল নম্বর:</strong> #{receiptToPrint.roll}
              </div>
              <div>
                <strong>ব্যাচের নাম:</strong> {receiptToPrint.batchName}
              </div>
              <div>
                <strong>ফি বাবদ মাস:</strong> {receiptToPrint.month}
              </div>
              <div>
                <strong>পরিশোধের মাধ্যম:</strong> {receiptToPrint.method}
              </div>
              <div>
                <strong>আদায়কারী:</strong> {receiptToPrint.collectedBy || 'অ্যাডমিন'}
              </div>
            </div>

            {/* Line Items Table */}
            <table className="receipt-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ক্র.নং</th>
                  <th>বিবরণ</th>
                  <th style={{ textAlign: 'right', width: '140px' }}>পরিমাণ (৳)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>০১.</td>
                  <td>
                    <strong>{receiptToPrint.feeType || 'মাসিক টিউশন ফি'}</strong> ({receiptToPrint.month})
                  </td>
                  <td style={{ textAlign: 'right' }}>৳{receiptToPrint.amount || receiptToPrint.paidAmount}</td>
                </tr>
                {receiptToPrint.discount > 0 && (
                  <tr>
                    <td>০২.</td>
                    <td style={{ color: '#059669' }}>স্কলারশিপ / বিশেষ ছাড়</td>
                    <td style={{ textAlign: 'right', color: '#059669' }}>- ৳{receiptToPrint.discount}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="2" style={{ textAlign: 'right', fontWeight: 700 }}>
                    মোট জমা কৃত অর্থ:
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: '#4F46E5' }}>
                    ৳{receiptToPrint.paidAmount}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total In Words */}
            <div
              style={{
                fontSize: '0.85rem',
                fontStyle: 'italic',
                color: '#374151',
                padding: '10px 14px',
                background: '#F9FAFB',
                borderRadius: '6px',
                marginBottom: '20px'
              }}
            >
              <strong>কথায়:</strong> মাত্র ৳{receiptToPrint.paidAmount} টাকা সফলভাবে গৃহীত হলো।
            </div>

            {/* Signatures */}
            <div className="receipt-signatures">
              <div className="signature-line">
                শিক্ষার্থী / অভিভাবকের স্বাক্ষর
              </div>
              <div className="signature-line" style={{ color: '#4F46E5', fontWeight: 700 }}>
                অফিসিয়াল সিল ও স্বাক্ষর
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={() => setReceiptToPrint(null)}>
            বন্ধ করুন
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            {t('btnPrintReceipt')}
          </button>
        </div>
      </div>
    </div>
  );
};
