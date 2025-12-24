import './Navigation.css'

function Navigation({ currentPage, onPageChange }) {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentPage === 'branch' ? 'active' : ''}`}
        onClick={() => onPageChange('branch')}
      >
        <span className="nav-icon">🏢</span>
        <span>Branch View</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => onPageChange('dashboard')}
      >
        <span className="nav-icon">📊</span>
        <span>Table View</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'collectionBranch' ? 'active' : ''}`}
        onClick={() => onPageChange('collectionBranch')}
      >
        <span className="nav-icon">💰</span>
        <span>Collection Branch</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'collection' ? 'active' : ''}`}
        onClick={() => onPageChange('collection')}
      >
        <span className="nav-icon">📋</span>
        <span>Collection Table</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'dealerOverview' ? 'active' : ''}`}
        onClick={() => onPageChange('dealerOverview')}
      >
        <span className="nav-icon">🏪</span>
        <span>Dealer Overview</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'corporateOverview' ? 'active' : ''}`}
        onClick={() => onPageChange('corporateOverview')}
      >
        <span className="nav-icon">🏛️</span>
        <span>Corporate Overview</span>
      </button>
    </nav>
  )
}

export default Navigation
