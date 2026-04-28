const TYPE_LABELS = {
  invoice: { label: 'Invoice', icon: '📋', color: '#2b6cb0' },
  bank_statement: { label: 'Bank Statement', icon: '🏦', color: '#276749' },
  resume: { label: 'Resume / CV', icon: '👤', color: '#6b46c1' },
  medical: { label: 'Medical Report', icon: '🏥', color: '#c53030' },
}

export default function ResultSection({ result, onReset }) {
  const typeInfo = TYPE_LABELS[result.reportType] || { label: result.reportType, icon: '📄', color: '#4a5568' }

  const fields = Object.entries(result.extractedFields).filter(
    ([, v]) => v !== null && v !== undefined && v !== false && !(Array.isArray(v) && v.length === 0)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Report type badge */}
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{typeInfo.icon}</span>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#718096' }}>Detected Type</p>
            <p style={{
              fontWeight: 700, fontSize: '1.2rem', color: typeInfo.color
            }}>{typeInfo.label}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', color: '#718096' }}>File</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{result.fileName}</p>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.75rem' }}>
          🤖 AI Summary
        </h3>
        <p style={{ lineHeight: 1.7, color: '#2d3748' }}>{result.summary}</p>
      </div>

      {/* Extracted Fields */}
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
          🔍 Extracted Fields
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {fields.map(([key, value]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: '1rem',
              padding: '0.6rem 0',
              borderBottom: '1px solid #f7fafc'
            }}>
              <span style={{
                fontSize: '0.85rem', color: '#718096',
                textTransform: 'capitalize', minWidth: '140px',
                fontWeight: 500
              }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </span>
              <span style={{
                fontSize: '0.9rem', color: '#2d3748',
                fontWeight: 600, textAlign: 'right'
              }}>
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyse another */}
      <button onClick={onReset} style={{
        padding: '0.9rem',
        background: 'white',
        color: '#2b6cb0',
        border: '2px solid #2b6cb0',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}>
        ← Analyse Another PDF
      </button>
    </div>
  )
}