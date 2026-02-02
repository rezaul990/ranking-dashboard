import { generatePlazaExcel } from './PlazaExcelExport'
import './PlazaPDFButton.css'

function PlazaPDFButton({ data }) {
  const handleGenerateExcel = async () => {
    if (!data || data.length === 0) {
      alert('No data available to generate Excel')
      return
    }
    
    await generatePlazaExcel(data)
  }

  return (
    <button 
      className="plaza-pdf-btn"
      onClick={handleGenerateExcel}
      title="Download Plaza Overview Excel"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Plaza Excel
    </button>
  )
}

export default PlazaPDFButton
