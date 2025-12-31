import { useState, useEffect, useRef } from 'react'
import './BranchView.css'
import './CollectionBranchView.css'
import { parseCSV, formatNumber } from '../utils/dataUtils'
import ScreenshotButton from '../components/ScreenshotButton'
import RefreshButton from '../components/RefreshButton'

// TODO: Replace with your actual spreadsheet link
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzdPUUVNNNlUy4U0SElgzASaiAFYoW05indKbBvRG-A9-Rs0WNZkZhMueUMhsFL9j98DUJV4UUqWRM/pub?output=csv'

function DealerOverview() {
  const [data, setData] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [showAllBranches, setShowAllBranches] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    if (CSV_URL) {
      fetchData()
    } else {
      setLoading(false)
      setError('Spreadsheet link not configured yet')
    }
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

  // TODO: Update card groups based on your spreadsheet columns
  const cardGroups = [
    {
      title: 'Dealer Qty',
      fields: [
        { label: 'Dealer Qty', field: 'Dealer Qty', type: 'qty' },
        { label: 'Positive Balance Qty', field: 'Positive Balance Qty', type: 'qty' },
        { label: 'Negative Balance Qty', field: 'Negative Balance Qty', type: 'qty' }
      ]
    },
    {
      title: 'Dealer Due',
      fields: [
        { label: 'Dealer Due', field: 'Dealer Due', type: 'amount' },
        { label: 'POS Due', field: 'POS Due', type: 'amount' },
        { label: 'EBS Due', field: 'EBS Due', type: 'amount' }
      ]
    },
    {
      title: 'Dealer Avg %',
      fields: [
        { label: 'Percentage', field: 'Dealer Avg %', type: 'percentage' }
      ]
    },
    {
      title: '0%-% Dealer Qty',
      fields: [
        { label: 'Quantity', field: '0%-% Dealer Qty', type: 'qty' }
      ]
    },
    {
      title: '3 Month No Coll',
      fields: [
        { label: 'Quantity', field: '3 Month No Coll', type: 'qty' }
      ]
    },
    {
      title: '1 Year No Coll',
      fields: [
        { label: 'Quantity', field: '1 Year No Coll', type: 'qty' }
      ]
    },
    {
      title: 'No Coll Qty (Running)',
      fields: [
        { label: 'Quantity', field: 'No Coll Qty', type: 'qty' }
      ]
    },
    {
      title: 'Sales VS Coll Running',
      fields: [
        { label: 'Total Sale', field: 'Total Sale', type: 'amount' },
        { label: 'POS Sale', field: 'POS Sale', type: 'amount' },
        { label: 'EBS Sale', field: 'EBS Sale', type: 'amount' },
        { label: 'POS Coll', field: 'POS Coll', type: 'amount' },
        { label: 'EBS Coll', field: 'EBS Coll', type: 'amount' },
        { label: 'Sales VS Coll', field: 'Sales VS Coll', type: 'percentage' }
      ]
    },
    {
      title: 'Policy Wise Collection Short',
      fields: [
        { label: 'Policy Wise Collection Short', field: 'Policy Wise Collection Short', type: 'amount' }
      ]
    },
    {
      title: 'Due Reduced (Running)',
      fields: [
        { label: 'Last Month Closing', field: 'Previous Month Due', type: 'amount' },
        { label: 'Running Due', field: 'Total Balance', type: 'amount' },
        { label: 'Due Reduced', field: 'Due Reduce', type: 'amount' }
      ]
    }
  ]

  const formatValue = (value, type) => {
    let displayValue = value
    
    if (type === 'amount') {
      const numVal = Math.round(parseValue(value))
      displayValue = `৳ ${formatNumber(numVal)}`
    } else if (type === 'qty') {
      displayValue = formatNumber(Math.round(parseValue(value)))
    } else if (type === 'percentage') {
      displayValue = value
    }
    
    return { displayValue, className: '' }
  }

  const handleCardAction = (cardTitle) => {
    // Card links mapping
    const cardLinks = {
      'Dealer Due': 'https://docs.google.com/spreadsheets/d/13E6Lx5oAYT8AU-8pdrA5VSF8w9hv6ToXJdyHXYka3IE/edit?gid=0#gid=0',
      'Dealer Avg %': 'https://docs.google.com/spreadsheets/d/13E6Lx5oAYT8AU-8pdrA5VSF8w9hv6ToXJdyHXYka3IE/edit?gid=0#gid=0',
      '0%-% Dealer Qty': 'https://docs.google.com/spreadsheets/d/1_2-oc57Q3O5TdPI6c5pTXADhY-5R6qtBWW0uTgLeOCM/edit?gid=0#gid=0',
      '3 Month No Coll': 'https://docs.google.com/spreadsheets/d/1_2-oc57Q3O5TdPI6c5pTXADhY-5R6qtBWW0uTgLeOCM/edit?gid=0#gid=0',
      '1 Year No Coll': 'https://docs.google.com/spreadsheets/d/1_2-oc57Q3O5TdPI6c5pTXADhY-5R6qtBWW0uTgLeOCM/edit?gid=0#gid=0'
    }
    
    const link = cardLinks[cardTitle]
    if (link) {
      window.open(link, '_blank')
    }
  }

  const renderCard = (cardGroup, branchData) => {
    // Check if Sales VS Coll value is > 0 for highlighting
    const salesVsCollValue = cardGroup.title === 'Sales VS Coll Running' 
      ? parseValue(branchData ? branchData['Sales VS Coll'] : 0)
      : 0
    const isHighlighted = cardGroup.title === 'Sales VS Coll Running' && salesVsCollValue > 0

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
            const value = branchData ? branchData[field.field] : 0
            const { displayValue, className } = formatValue(value, field.type)
            
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
        const total = data.reduce((sum, branch) => {
          return sum + (field.type === 'qty' ? parseIntValue(branch[field.field]) : parseValue(branch[field.field]))
        }, 0)
        aggregated[field.field] = total
      })
    })
    
    return aggregated
  }

  if (loading) return <div className="loading">Loading data...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <>
      <div className="page-header-actions">
        <div></div>
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
                <div className="branch-subtitle">Dealer Overview Metrics</div>
              </div>

              <div className="collection-cards-grid">
                {cardGroups.map(group => renderCard(group, calculateAllBranchesData()))}
              </div>
            </div>
            <ScreenshotButton 
              targetRef={detailsRef} 
              fileName="all-branches-dealer-report"
            />
          </>
        ) : selectedBranch && (
          <>
            <div className="branch-details" ref={detailsRef}>
              <div className="branch-header">
                <h2>{selectedBranch['Branch Name']}</h2>
                <div className="branch-subtitle">Dealer Overview Metrics</div>
              </div>

              <div className="collection-cards-grid">
                {cardGroups.map(group => renderCard(group, selectedBranch))}
              </div>
            </div>
            <ScreenshotButton 
              targetRef={detailsRef} 
              fileName={`${selectedBranch['Branch Name'].replace(/\s+/g, '-')}-dealer-report`}
            />
          </>
        )}
      </div>
    </>
  )
}

export default DealerOverview
