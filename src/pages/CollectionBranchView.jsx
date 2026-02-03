import { useState, useEffect, useRef } from 'react'
import './BranchView.css'
import './CollectionBranchView.css'
import { parseCSV, formatNumber } from '../utils/dataUtils'
import ScreenshotButton from '../components/ScreenshotButton'
import RefreshButton from '../components/RefreshButton'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXc-G_Yb3upkVljn0pXdzHqV5dAPr-TW47o9uKy8qQNRkiknwZx7wgSLESLsckivRHS73dRN3UaWcm/pub?output=csv'

function CollectionBranchView() {
  const [data, setData] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [showAllBranches, setShowAllBranches] = useState(true)
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
      setData(parsed)
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

  const parseValue = (val) => parseFloat(String(val || 0).replace(/,/g, '')) || 0
  const parseIntValue = (val) => Number(String(val || 0).replace(/,/g, '')) || 0

  const getOverdueClass = (pct) => {
    if (pct < 10) return 'good'
    if (pct < 20) return 'warn'
    return 'bad'
  }

  const getCollectionClass = (pct) => {
    if (pct >= 30) return 'good'
    if (pct >= 20) return 'warn'
    return 'bad'
  }

  const getIncreaseDecreaseClass = (val) => {
    if (val < 0) return 'good'
    if (val === 0) return ''
    return 'bad'
  }

  const cardGroups = [
    {
      title: 'Hire Outstanding',
      fields: [
        { label: 'Hire Outstanding', field: 'Hire Outstanding', type: 'amount' },
        { label: 'Outstanding POS', field: 'Outstanding POS', type: 'amount' },
        { label: 'New Outstanding Added', field: 'New Outstanding Added', type: 'amount' },
        { label: 'Total Update Outstanding', field: 'Total Update Outstanding', type: 'amount' }
      ]
    },
    {
      title: 'Running AC',
      fields: [
        { label: 'Collectible', field: 'Running AC (Collectilbe)', type: 'qty' },
        { label: 'POS', field: 'Running AC (POS)', type: 'qty' }
      ]
    },
    {
      title: 'Overdue',
      fields: [
        { label: 'Previous Month', field: 'Overdue Previous Month', type: 'amount' },
        { label: 'Running Month', field: 'Overdue Running Month', type: 'amount' },
        { label: 'Increase/Decrease', field: 'Overdue Increase/Decrease', type: 'amount', getClass: getIncreaseDecreaseClass },
        { label: 'Overdue %', field: 'Overdue %', type: 'percentage', getClass: getOverdueClass }
      ]
    },
    {
      title: 'Overdue Structure',
      fields: [
        { label: '10K+ OD Qty', field: '10K+ OD Qty', type: 'qty' },
        { label: '20K+ OD Qty', field: '20K+ OD Qty', type: 'qty' },
        { label: 'Mature Qty', field: 'Matured Overdue Qty', type: 'qty' },
        { label: 'Total Overdue AC Qty (POS)', field: 'Total Overdue AC Qty (POS)', type: 'qty' },
        { label: 'Total Overdue AC Qty (Collectible)', field: 'Total Overdue AC Qty (Collectible)', type: 'qty' }
      ]
    },
    {
      title: 'Collection',
      fields: [
        { label: 'Collectible Qty', field: 'Collectible Qty', type: 'qty' },
        { label: 'Collected Qty', field: 'Collected Qty', type: 'qty' },
        { label: 'Collection %', field: 'Collection Qty %', type: 'percentage', getClass: getCollectionClass },
        { label: 'Last Month Card Coll %', field: 'Last Month Card Coll %', type: 'percentage' }
      ]
    },
    {
      title: 'Mobile Overdue',
      fields: [
        { label: 'Previous Month', field: 'Mobile Overdue Previous Month', type: 'amount' },
        { label: 'Running Month', field: 'Mobile Overdue Running Month', type: 'amount' },
        { label: 'Increase/Decrease', field: 'Mobile Overdue Increase/Decrease', type: 'amount', getClass: getIncreaseDecreaseClass }
      ]
    },
    {
      title: '2024 Overdue',
      fields: [
        { label: 'Previous Month', field: '2024 Overdue Previous Month', type: 'amount' },
        { label: 'Running Month', field: '2024 Overdue Running Month', type: 'amount' },
        { label: 'Increase/Decrease', field: '2024 Overdue Increase/Decrease', type: 'amount', getClass: getIncreaseDecreaseClass }
      ]
    },
    {
      title: '2025 Overdue',
      fields: [
        { label: 'Previous Month', field: '2025 Overdue Previous Month', type: 'amount' },
        { label: 'Running Month', field: '2025 Overdue Running Month', type: 'amount' },
        { label: 'Increase/Decrease', field: '2025 Overdue Increase/Decrease', type: 'amount', getClass: getIncreaseDecreaseClass }
      ]
    },
    {
      title: 'No Coll',
      fields: [
        { label: '3+ Month No Coll', field: '3+ Month No Coll', type: 'qty' },
        { label: '6 Month No Coll', field: '6 Month No Coll', type: 'qty' },
        { label: 'Only DP', field: 'Only DP', type: 'qty' },
        { label: '1st Month No Coll', field: '1st Month No Coll', type: 'qty' }
      ]
    },
    {
      title: 'Matured Overdue',
      fields: [
        { label: 'Quantity', field: 'Matured Overdue Qty', type: 'qty' },
        { label: 'Amount', field: 'Matured Overdue Amount', type: 'amount' },
        { label: 'Mature Qty POS', field: 'Mature Qty POS', type: 'qty' },
        { label: 'Mature Amount POS', field: 'Mature Amount POS', type: 'amount' }
      ]
    },
    {
      title: 'MRP+ Collected Qty',
      fields: [
        { label: 'MRP+ Qty', field: 'MRP Collected Qty', type: 'qty' },
        { label: 'Hire Cash Qty', field: 'HCP Collected', type: 'qty' },
        { label: 'Only MRP Qty', field: 'Only MRP Collected Qty', type: 'qty' },
        { label: 'MRP+10% Qty', field: 'MRP+10% Qty', type: 'qty' }
      ]
    },
    {
      title: 'Revert',
      fields: [
        { label: 'Revert', field: 'Revert', type: 'qty' },
        { label: 'Resale', field: 'Revert Resale', type: 'qty' },
        { label: 'Product in Plaza', field: 'Revert Product in Plaza', type: 'qty' },
        { label: 'Death Qty', field: 'Death Qty', type: 'qty' },
        { label: 'Overdue (Death+Resale)', field: 'Revert Overdue (Collectible) Death + Resale', type: 'amount' }
      ]
    },
    {
      title: 'Employee Corruption',
      fields: [{ label: 'Quantity', field: 'Employee Corruption Qty', type: 'qty' }]
    }
  ]

  const formatValue = (value, type, getClass) => {
    let displayValue = value
    let className = ''
    
    if (type === 'amount') {
      const numVal = parseValue(value)
      displayValue = `৳ ${formatNumber(numVal)}`
    } else if (type === 'qty') {
      displayValue = formatNumber(value)
    } else if (type === 'percentage') {
      const pct = parseFloat(String(value || '0%').replace('%', ''))
      className = getClass ? getClass(pct) : ''
      displayValue = value
    }
    
    if (getClass && type === 'amount') {
      const numVal = parseValue(value)
      className = getClass(numVal)
    }
    
    return { displayValue, className }
  }

  const handleCardAction = (cardTitle, event) => {
    // Prevent double-firing if button is clicked
    if (event) {
      event.stopPropagation()
    }
    
    // Card links mapping
    const cardLinks = {
      'Hire Outstanding': 'https://docs.google.com/spreadsheets/d/1rIaSRs1SrmKfoGsSC07xN0QxuOENWZjWEnu4kepSkfc/edit?gid=0#gid=0',
      'Running AC': 'https://docs.google.com/spreadsheets/d/1rIaSRs1SrmKfoGsSC07xN0QxuOENWZjWEnu4kepSkfc/edit?gid=0#gid=0',
      'Overdue': 'https://docs.google.com/spreadsheets/d/1TDYIloJEJHJy00IhtWLXJCFpTweHKa5MNmKdqNrX9zA/edit?gid=0#gid=0',
      'Overdue Structure': 'https://docs.google.com/spreadsheets/d/1TDYIloJEJHJy00IhtWLXJCFpTweHKa5MNmKdqNrX9zA/edit?gid=0#gid=0',
      'Collection': 'https://docs.google.com/spreadsheets/d/1rIaSRs1SrmKfoGsSC07xN0QxuOENWZjWEnu4kepSkfc/edit?gid=0#gid=0',
      'Mobile Overdue': 'https://docs.google.com/spreadsheets/d/1rIaSRs1SrmKfoGsSC07xN0QxuOENWZjWEnu4kepSkfc/edit?gid=0#gid=0',
      '2024 Overdue': 'https://docs.google.com/spreadsheets/d/1sozfJbjVe_pjTA0EX_E-Ax9KyUB3241wNPlr1tC-bMM/edit?gid=548224984#gid=548224984',
      '2025 Overdue': 'https://docs.google.com/spreadsheets/d/16uw6cHTROwrayGCJD9mWSc_0XdVcB-GsU-wB3Zzi9XQ/edit?gid=0#gid=0',
      'No Coll': 'https://docs.google.com/spreadsheets/d/1USOjHngxvh5WmDpkF72CtpyGjkCERZz0wQcZvkdICTU/edit?gid=0#gid=0',
      'Matured Overdue': 'https://docs.google.com/spreadsheets/d/1IChJZP8LR9UVkZIA_PNGYMZx7UPOOkC-RwzD7GqVPLY/edit?gid=1004473595#gid=1004473595',
      'MRP+ Collected Qty': 'https://docs.google.com/spreadsheets/d/1rIaSRs1SrmKfoGsSC07xN0QxuOENWZjWEnu4kepSkfc/edit?gid=0#gid=0',
      'Revert': 'https://docs.google.com/spreadsheets/d/1IRLUIsWS-Icu05NZ2ZE71-QnSc5BwnV1K4vqVulWWG4/edit?gid=0#gid=0',
      'Employee Corruption': 'https://docs.google.com/spreadsheets/d/1IRLUIsWS-Icu05NZ2ZE71-QnSc5BwnV1K4vqVulWWG4/edit?gid=0#gid=0'
    }
    
    const link = cardLinks[cardTitle]
    if (link) {
      window.open(link, '_blank')
    } else {
      console.log(`No link configured for: ${cardTitle}`)
    }
  }

  const parsePercentage = (val) => parseFloat(String(val || '0%').replace('%', '')) || 0

  const renderCard = (cardGroup, branchData) => {
    // Check if Collection card should be highlighted
    let isHighlighted = false
    if (cardGroup.title === 'Collection') {
      const collectionPct = parsePercentage(branchData['Collection Qty %'])
      const lastMonthPct = parsePercentage(branchData['Last Month Card Coll %'])
      isHighlighted = collectionPct < lastMonthPct
    }

    // Highlight No Coll card if 1st Month No Coll > 0 or Only DP > 0
    if (cardGroup.title === 'No Coll') {
      const firstMonthNoColl = parseIntValue(branchData['1st Month No Coll'])
      const onlyDP = parseIntValue(branchData['Only DP'])
      isHighlighted = firstMonthNoColl > 0 || onlyDP > 0
    }

    // Highlight Overdue Structure card if 10K+ OD Qty > 10
    if (cardGroup.title === 'Overdue Structure') {
      const tenKODQty = parseIntValue(branchData['10K+ OD Qty'])
      isHighlighted = tenKODQty > 10
    }

    return (
      <div 
        key={cardGroup.title} 
        className={`collection-metric-card ${isHighlighted ? 'card-highlight-red' : ''}`}
        onClick={() => handleCardAction(cardGroup.title)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardAction(cardGroup.title)
          }
        }}
      >
        <div className="card-header-row">
          <div className="card-title">{cardGroup.title}</div>
          <div className="card-action-btn" title="View Details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </div>
        <div className="card-content">
          {cardGroup.fields.map((field) => {
            const value = branchData[field.field]
            const { displayValue, className } = formatValue(value, field.type, field.getClass)
            
            return (
              <div key={field.label} className="card-row">
                <span className="card-label">{field.label}:</span>
                <span className={`card-value ${className}`}>{displayValue}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const calculateAllBranchesData = () => {
    const aggregated = {}
    
    cardGroups.forEach(group => {
      group.fields.forEach(field => {
        if (field.type === 'percentage') {
          if (field.field === 'Overdue %') {
            const totalOutstanding = data.reduce((sum, b) => sum + parseValue(b['Hire Outstanding']), 0)
            const totalOverdue = data.reduce((sum, b) => sum + parseValue(b['Overdue Running Month']), 0)
            aggregated[field.field] = totalOutstanding ? `${((totalOverdue / totalOutstanding) * 100).toFixed(2)}%` : '0%'
          } else if (field.field === 'Collection Qty %') {
            const totalCollectible = data.reduce((sum, b) => sum + parseIntValue(b['Collectible Qty']), 0)
            const totalCollected = data.reduce((sum, b) => sum + parseIntValue(b['Collected Qty']), 0)
            aggregated[field.field] = totalCollectible ? `${((totalCollected / totalCollectible) * 100).toFixed(2)}%` : '0%'
          }
        } else {
          const total = data.reduce((sum, branch) => {
            return sum + (field.type === 'qty' ? parseIntValue(branch[field.field]) : parseValue(branch[field.field]))
          }, 0)
          aggregated[field.field] = total
        }
      })
    })
    
    return aggregated
  }

  if (loading) return <div className="loading">Loading data...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <>
      <div className="page-header-actions">
        <RefreshButton onClick={fetchData} loading={loading} />
      </div>
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
                <div className="branch-subtitle">Total Collection & Overdue Metrics</div>
              </div>

              <div className="collection-cards-grid">
                {cardGroups.map(group => renderCard(group, calculateAllBranchesData()))}
              </div>
            </div>
            <ScreenshotButton 
              targetRef={detailsRef} 
              fileName="all-branches-collection-report"
            />
          </>
        ) : selectedBranch && (
          <>
            <div className="branch-details" ref={detailsRef}>
              <div className="branch-header">
                <h2>{selectedBranch['Branch Name']}</h2>
                <div className="branch-subtitle">Collection & Overdue Metrics</div>
              </div>

              <div className="collection-cards-grid">
                {cardGroups.map(group => renderCard(group, selectedBranch))}
              </div>
            </div>
            <ScreenshotButton 
              targetRef={detailsRef} 
              fileName={`${selectedBranch['Branch Name'].replace(/\s+/g, '-')}-collection-report`}
            />
          </>
        )}
      </div>
    </>
  )
}

export default CollectionBranchView
