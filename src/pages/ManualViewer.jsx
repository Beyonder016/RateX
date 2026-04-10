import React from 'react';

const manualPdfPath = '/ratex-website-manual.pdf';

const ManualViewer = () => {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #dbeafe',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem', fontWeight: 800, color: '#1e293b' }}>
            Website Manual
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Read the RateX guide here or download the PDF.
          </p>
        </div>

        <a
          href={manualPdfPath}
          download="ratex-website-manual.pdf"
          style={{
            textDecoration: 'none',
            padding: '0.8rem 1.1rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 8px 18px rgba(34, 197, 94, 0.22)',
          }}
        >
          Download PDF
        </a>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '22px',
        border: '1px solid #dbeafe',
        overflow: 'hidden',
        minHeight: '75vh',
      }}>
        <iframe
          src={`${manualPdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
          title="RateX Website Manual PDF"
          style={{ width: '100%', height: '75vh', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  );
};

export default ManualViewer;
