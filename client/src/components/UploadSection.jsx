import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadSection({ onUpload, loading, error }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: loading
  })

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  return (
    <div>
      {/* Supported formats */}
      <div style={{
        display: 'flex', gap: '0.75rem', marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {['📋 Invoice', '🏦 Bank Statement', '👤 Resume/CV', '🏥 Medical Report'].map(label => (
          <span key={label} style={{
            background: 'white', border: '1px solid #cbd5e0',
            borderRadius: '20px', padding: '0.3rem 0.9rem',
            fontSize: '0.85rem', color: '#4a5568'
          }}>{label}</span>
        ))}
      </div>

      {/* Dropzone */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#3182ce' : '#a0aec0'}`,
        borderRadius: '12px',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: isDragActive ? '#ebf8ff' : 'white',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {isDragActive ? '📂' : '📁'}
        </div>
        {selectedFile ? (
          <div>
            <p style={{ fontWeight: 600, color: '#2d3748' }}>✅ {selectedFile.name}</p>
            <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.3rem' }}>
              {(selectedFile.size / 1024).toFixed(1)} KB — Click to change
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: 600, color: '#2d3748', fontSize: '1.1rem' }}>
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </p>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>or click to browse</p>
            <p style={{ color: '#a0aec0', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Max 10MB · PDF only
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '1rem', padding: '0.75rem 1rem',
          background: '#fff5f5', border: '1px solid #fc8181',
          borderRadius: '8px', color: '#c53030', fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '0.9rem',
          background: !selectedFile || loading ? '#a0aec0' : '#2b6cb0',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: !selectedFile || loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {loading ? '⏳ Analysing PDF...' : '🔍 Extract & Analyse'}
      </button>
    </div>
  )
}