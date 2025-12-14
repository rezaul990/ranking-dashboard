import './Navigation.css'

function Navigation({ currentPage, onPageChange }) {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => onPageChange('dashboard')}
      >
        <span className="nav-icon">📊</span>
        <span>All Branches</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'branch' ? 'active' : ''}`}
        onClick={() => onPageChange('branch')}
      >
        <span className="nav-icon">🏢</span>
        <span>Branch View</span>
      </button>
    </nav>
  )
}

export default Navigation
