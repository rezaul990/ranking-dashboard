import './RefreshButton.css'

function RefreshButton({ onClick, loading }) {
  return (
    <button 
      className={`refresh-button ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={loading}
      title="Refresh Data"
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="refresh-icon"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
      <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  )
}

export default RefreshButton
