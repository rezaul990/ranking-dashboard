import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import BranchView from './pages/BranchView'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="container">
      <header>
        <div>
          <h1>Walton Plaza – Branch Dashboard</h1>
          <div className="subtitle">Performance Analytics & Insights</div>
        </div>
        <div className="subtitle">Real-time Data</div>
      </header>

      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {currentPage === 'dashboard' ? <Dashboard /> : <BranchView />}

      <footer>🟢 ≥100% | 🟡 80–99% | 🔴 &lt;80%</footer>
    </div>
  )
}

export default App
