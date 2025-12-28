import { useState, useEffect, useRef } from 'react'
import './BranchView.css'
import { parseCSV, calculatePercentage, getPercentageClass, formatNumber, extractUpdateDate } from '../utils/dataUtils'
import ScreenshotButton from '../components/ScreenshotButton'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBMgoqCsNi4oAnvtFsSMEdxLLy1mdwFXLehQ2ZfjdHwHQq2mHGb0283g76EneTkFvKuvN8SPC9dll/pub?output=csv'

function BranchView() {
  const [data, setData] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [showAllBranches, setShowAllBranches] = useState(false)
  const [updateDate, setUpdateDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(CSV_URL)
      const text = await response.text()
      const parsed = parseCSV(text)
      const date = extractUpdateDate(text)
      setData(parsed)
      setUpdateDate(date)
      if (parsed.length > 0) {
        setSelectedBranch(parsed[0])
      }
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBranchSelect = (branch) => {
    if (branch === 'all') {
      setShowAllBranches(true)
      setSelectedBranch(null)
    } else {
      setShowAllBranches(false)
      setSelectedBranch(branch)
    }
  }

  const metrics = [
    { label: 'Total', target: 'Total Target', ach: 'Total Ach' },
    { label: 'Retail', target: 'Retail Target', ach: 'Retial Ach' },
    { label: 'Hire', target: 'Hire Target', ach: 'Hire Ach' },
    { label: 'Hire DP', target: 'Hire DP Target', ach: 'Hire DP Ach' },
    { label: 'INS / LPR', target: 'INS or LPR Target', ach: 'INS or LPR Ach' },
    { label: 'Exec Collection', target: 'Hire Collection Executive (Qty.) Target', ach: 'Hire Collection Executive (Qty.) Ach' },
    { label: 'Self Collection', target: 'Hire Collection Self (Qty.) Target', ach: 'Hire Collection Self (Qty.) Ach' },
    { label: 'Dealer & Corporate Sales', target: 'Dealer & Corporate Sales Target', ach: 'Dealer & Corporate Sales Ach' },
    { label: 'Dealer & Corporate Collection', target: 'Dealer & Corporate Collection Target', ach: 'Dealer & Corporate Collection Ach' },
    { label: 'Profit', target: 'Profit Target', ach: 'Profit Ach' }
  ]

  // Cards that should be highlighted red when progress < 65%
  const highlightCards65 = ['Retail', 'Hire', 'Dealer & Corporate Sales']
  // Cards that should be highlighted red when progress < 90%
  const highlightCards90 = ['INS / LPR', 'Exec Collection', 'Self Collection']
  // Cards that should be highlighted red when progress < 100%
  const highlightCards100 = ['Hire DP', 'Dealer & Corporate Collection']

  const shouldHighlightCard = (label, pct) => {
    if (highlightCards65.includes(label) && pct < 65) return true
    if (highlightCards90.includes(label) && pct < 90) return true
    if (highlightCards100.includes(label) && pct < 100) return true
    if (label === 'Profit' && pct < 0) return true
    return false
  }

  if (loading) return <div className="loading">Loading data...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <>
      {updateDate && (
        <div className="update-date-banner">
          <span className="update-icon">📅</span>
          <span className="update-text">Last Updated: {updateDate}</span>
        </div>
      )}
      
      <div className="branch-view">
        <div className="branch-selector-card">
          <h2>Select Branch</h2>
          <div className="branch-list">
            <button
              className={`branch-item all-branches ${showAllBranches ? 'active' : ''}`}
              onClick={() => handleBranchSelect('all')}
            >
              <span className="branch-name">📊 All Branches Combined</span>
              <span className="branch-arrow">→</span>
            </button>
            {data.map((branch, idx) => (
              <button
                key={idx}
                className={`branch-item ${selectedBranch === branch ? 'active' : ''}`}
                onClick={() => handleBranchSelect(branch)}
              >
                <span className="branch-name">{branch['Branch Name']}</span>
                <span className="branch-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

      {showAllBranches ? (
        <>
          <div className="branch-details" ref={detailsRef}>
            <div className="branch-header">
              <h2>📊 All Branches Combined</h2>
              <div className="branch-subtitle">Total Performance Metrics</div>
            </div>

            <div className="metrics-grid">
              {metrics.map((metric, idx) => {
                let totalTarget = 0
                let totalAch = 0
                
                data.forEach(branch => {
                  totalTarget += Number(String(branch[metric.target] || 0).replace(/,/g, ''))
                  totalAch += Number(String(branch[metric.ach] || 0).replace(/,/g, ''))
                })
                
                const pct = calculatePercentage(totalTarget, totalAch)
                const pctClass = getPercentageClass(pct)
                const shouldHighlight = shouldHighlightCard(metric.label, pct)

                return (
                  <div key={idx} className={`metric-card ${shouldHighlight ? 'card-highlight-red' : ''}`}>
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-values">
                      <div className="metric-row">
                        <span className="metric-title">Target:</span>
                        <span className="metric-value">{formatNumber(totalTarget)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-title">Achievement:</span>
                        <span className="metric-value">{formatNumber(totalAch)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-title">Progress:</span>
                        <span className={`metric-percentage ${pctClass}`}>{pct}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${pctClass}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <ScreenshotButton 
            targetRef={detailsRef} 
            fileName="all-branches-combined-report"
          />
        </>
      ) : selectedBranch && (
        <>
          <div className="branch-details" ref={detailsRef}>
            <div className="branch-header">
              <h2>{selectedBranch['Branch Name']}</h2>
              <div className="branch-subtitle">Performance Metrics</div>
            </div>

            <div className="metrics-grid">
              {metrics.map((metric, idx) => {
                const target = selectedBranch[metric.target]
                const ach = selectedBranch[metric.ach]
                const pct = calculatePercentage(target, ach)
                const pctClass = getPercentageClass(pct)
                const shouldHighlight = shouldHighlightCard(metric.label, pct)

                return (
                  <div key={idx} className={`metric-card ${shouldHighlight ? 'card-highlight-red' : ''}`}>
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-values">
                      <div className="metric-row">
                        <span className="metric-title">Target:</span>
                        <span className="metric-value">{formatNumber(target)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-title">Achievement:</span>
                        <span className="metric-value">{formatNumber(ach)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-title">Progress:</span>
                        <span className={`metric-percentage ${pctClass}`}>{pct}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${pctClass}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <ScreenshotButton 
            targetRef={detailsRef} 
            fileName={`${selectedBranch['Branch Name'].replace(/\s+/g, '-')}-report`}
          />
        </>
      )}
      </div>
    </>
  )
}

export default BranchView
