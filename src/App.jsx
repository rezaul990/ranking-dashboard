import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import BranchView from './pages/BranchView'
import CollectionDashboard from './pages/CollectionDashboard'
import CollectionBranchView from './pages/CollectionBranchView'
import DealerOverview from './pages/DealerOverview'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [currentPage, setCurrentPage] = useState('branch')

  const renderPage = () => {
    switch(currentPage) {
      case 'branch':
        return <BranchView />
      case 'dashboard':
        return <Dashboard />
      case 'collection':
        return <CollectionDashboard />
      case 'collectionBranch':
        return <CollectionBranchView />
      case 'dealerOverview':
        return <DealerOverview />
      default:
        return <BranchView />
    }
  }

  return (
    <div className="container">
      <ThemeToggle />
      
      <header>
        <div>
          <h1>Walton Plaza – Branch Dashboard</h1>
          <div className="subtitle">Performance Analytics & Insights</div>
        </div>
        <div className="subtitle">Real-time Data</div>
      </header>

      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {renderPage()}

      <footer>🟢 ≥100% | 🟡 80–99% | 🔴 &lt;80%</footer>
    </div>
  )
}

export default App
