import { useState } from 'react'
import UploadSection from './components/UploadSection'
import ResultSection from './components/ResultSection'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const res = await fetch('http://localhost:5000/api/extract', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <header style={{
        background: '#1a365d',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <span style={{ fontSize: '1.8rem' }}>📄</span>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Smart Report Extractor</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>AI-powered PDF analysis</p>
        </div>
      </header>

      <main style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1rem' }}>
        {!result ? (
          <UploadSection
            onUpload={handleUpload}
            loading={loading}
            error={error}
          />
        ) : (
          <ResultSection result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}