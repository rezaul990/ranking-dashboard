import { useState, useEffect, useRef } from 'react'
import './BranchView.css'
import './CollectionBranchView.css'
import './CorporateOverview.css'
import { parseCSV, formatNumber } from '../utils/dataUtils'
import ScreenshotButton from '../components/ScreenshotButton'
import RefreshButton from '../components/RefreshButton'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQncKkos2W7Eow929EBmY_ZbqQzrxwUCAuLit03kqei2ho8ICBE5xcdp2-LHA2hPb2jbyov6FfClOF2/pub?output=csv'

function CorporateOverview() {
  const [data, setData] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [showAllBranches, setShowAllBranches] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [columns, setColumns] = useState([])
  const [expandedParties, setExpandedParties] = useState({})
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
      
      // Get column names from first row
      if (parsed.length > 0) {
        const cols = Object.keys(parsed[0]).filter(col => col !== 'Branch Name' && col !== 'S/N' && col.trim())
        setColumns(cols)
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
    // Reset expanded parties when changing branches
    setExpandedParties({})
  }

  const toggleParties = (cardTitle) => {
    setExpandedParties(prev => ({
      ...prev,
      [cardTitle]: !prev[cardTitle]
    }))
  }

  const parseValue = (val) => parseFloat(String(val || 0).replace(/,/g, '')) || 0

  const formatValue = (value, type = 'number', isExpanded = false) => {
    if (type === 'text') {
      if (value && value.trim() !== '') {
        // Split by " , " (space, comma, space) to properly separate party entries for Corporate Overview
        const items = value.split(' , ').filter(item => item.trim() !== '')
        
        if (isExpanded) {
          // Format each item with numbering and check for collection value
          return items.map((item, index) => {
            // Check if item contains "Collection=" to determine color
            const hasCollection = item.includes('Collection=')
            let collectionValue = 0
            
            if (hasCollection) {
              // Extract collection value (format: "Collection= 123,456" or "Collection=0")
              const collectionMatch = item.match(/Collection=\s*([0-9,]+)/)
              if (collectionMatch) {
                collectionValue = parseFloat(collectionMatch[1].replace(/,/g, '')) || 0
              }
            }
            
            // Add color indicator based on collection value
            const colorClass = collectionValue > 0 ? '🟢' : '🔴'
            return `${colorClass} ${index + 1}. ${item}`
          }).join('\n')
        } else {
          return `${items.length} ${items.length === 1 ? 'Party' : 'Parties'} (Click to view)`
        }
      } else {
        return '-'
      }
    }
    
    // Default number formatting
    const numVal = parseValue(value)
    if (numVal === 0 && value && isNaN(parseFloat(String(value).replace(/,/g, '')))) {
      return value // Return as-is if it's text
    }
    return formatNumber(numVal)
  }

  const calculateAllBranchesData = () => {
    const aggregated = {}
    columns.forEach(col => {
      // Check if this is a text field (Party List columns)
      if (col.includes('Party List') || col.includes('Dealer List') || col.includes('Qty List')) {
        // For text fields, collect all non-empty values from all branches
        const textValues = data
          .filter(branch => branch['Branch Name'] && branch['Branch Name'].toLowerCase() !== 'area')
          .map(branch => branch[col])
          .filter(val => val && val.trim() !== '')
        
        // Join all text values with " , " separator (space, comma, space)
        aggregated[col] = textValues.length > 0 ? textValues.join(' , ') : ''
      } else {
        const total = data.reduce((sum, branch) => sum + parseValue(branch[col]), 0)
        aggregated[col] = total
      }
    })
    return aggregated
  }

  // Columns to exclude from individual cards (they'll be grouped)
  const groupedColumns = ['POS Due', 'EBS Due', 'POS Sale', 'EBS Sale', 'POS Coll', 'EBS Coll', 'Positive Balance', 'Negative Balance', 'No Coll Running Month', 'Coll 3 Month No Coll Qty', 'Coll 1 Year No Coll Qty', '3 Month No Coll Qty List', '1 Year No Coll Qty List', 'No Coll Party List', '3 Month No Coll', '1 Year No Coll']

  // Card links mapping - add links here for cards that should be clickable
  const cardLinks = {
    '3 Month No Coll': 'https://docs.google.com/spreadsheets/d/186xgrL76QLV16n-XOHW2SRFoRz0MX_QB3B6eIlYAiE0/edit?gid=0#gid=0',
    '1 Year No Coll': 'https://docs.google.com/spreadsheets/d/186xgrL76QLV16n-XOHW2SRFoRz0MX_QB3B6eIlYAiE0/edit?gid=0#gid=0',
    'No Coll Qty (Running)': 'https://docs.google.com/spreadsheets/d/186xgrL76QLV16n-XOHW2SRFoRz0MX_QB3B6eIlYAiE0/edit?gid=0#gid=0',
  }

  const handleCardAction = (cardTitle) => {
    const link = cardLinks[cardTitle]
    if (link) {
      window.open(link, '_blank')
    }
  }

  const CardActionButton = () => (
    <div className="card-action-btn" title="View Details">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </div>
  )
  
  const renderMetricCard = (label, value) => {
    const numVal = parseValue(value)
    const isPositiveShort = label === 'Sales vs Coll Short' && numVal > 0
    
    return (
      <div 
        key={label} 
        className="collection-metric-card"
        onClick={() => handleCardAction(label)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardAction(label)
          }
        }}
      >
        <div className="card-header-row">
          <div className="card-title">{label}</div>
          <CardActionButton />
        </div>
        <div className="card-content">
          <div className="card-row">
            <span className={`card-value ${isPositiveShort ? 'value-red' : ''}`}>{formatValue(value)}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderPartyQtyCard = (branchData) => (
    <div 
      key="party-qty" 
      className="collection-metric-card"
      onClick={() => handleCardAction('Party Qty')}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardAction('Party Qty')
        }
      }}
    >
      <div className="card-header-row">
        <div className="card-title">Party Qty</div>
        <CardActionButton />
      </div>
      <div className="card-content">
        <div className="card-row">
          <span className="card-label">Party Qty:</span>
          <span className="card-value">{formatValue(branchData['Party Qty'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Positive Balance:</span>
          <span className="card-value">{formatValue(branchData['Positive Balance'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Negative Balance:</span>
          <span className="card-value">{formatValue(branchData['Negative Balance'])}</span>
        </div>
      </div>
    </div>
  )

  const renderCorporateDueCard = (branchData) => (
    <div 
      key="corporate-due" 
      className="collection-metric-card"
      onClick={() => handleCardAction('Corporate Due')}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardAction('Corporate Due')
        }
      }}
    >
      <div className="card-header-row">
        <div className="card-title">Corporate Due</div>
        <CardActionButton />
      </div>
      <div className="card-content">
        <div className="card-row">
          <span className="card-label">Corporate Due:</span>
          <span className="card-value">{formatValue(branchData['Corpoate Due'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">POS Due:</span>
          <span className="card-value">{formatValue(branchData['POS Due'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">EBS Due:</span>
          <span className="card-value">{formatValue(branchData['EBS Due'])}</span>
        </div>
      </div>
    </div>
  )

  const renderTotalSaleCard = (branchData) => (
    <div 
      key="total-sale" 
      className="collection-metric-card"
      onClick={() => handleCardAction('Total Sale')}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardAction('Total Sale')
        }
      }}
    >
      <div className="card-header-row">
        <div className="card-title">Total Sale</div>
        <CardActionButton />
      </div>
      <div className="card-content">
        <div className="card-row">
          <span className="card-label">Total Sale:</span>
          <span className="card-value">{formatValue(branchData['Total Sale'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">POS Sale:</span>
          <span className="card-value">{formatValue(branchData['POS Sale'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">EBS Sale:</span>
          <span className="card-value">{formatValue(branchData['EBS Sale'])}</span>
        </div>
      </div>
    </div>
  )

  const renderTotalCollCard = (branchData) => (
    <div 
      key="total-coll" 
      className="collection-metric-card"
      onClick={() => handleCardAction('Total Coll')}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardAction('Total Coll')
        }
      }}
    >
      <div className="card-header-row">
        <div className="card-title">Total Coll</div>
        <CardActionButton />
      </div>
      <div className="card-content">
        <div className="card-row">
          <span className="card-label">Total Coll:</span>
          <span className="card-value">{formatValue(branchData['Total Coll'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">POS Coll:</span>
          <span className="card-value">{formatValue(branchData['POS Coll'])}</span>
        </div>
        <div className="card-row">
          <span className="card-label">EBS Coll:</span>
          <span className="card-value">{formatValue(branchData['EBS Coll'])}</span>
        </div>
      </div>
    </div>
  )

  const renderNoCollRunningCard = (branchData) => {
    const partiesValue = branchData['No Coll Party List']
    const isExpanded = expandedParties['No Coll Qty (Running)']
    const formattedParties = formatValue(partiesValue, 'text', isExpanded)
    
    return (
      <div 
        key="no-coll-running" 
        className="collection-metric-card"
        onClick={() => handleCardAction('No Coll Qty (Running)')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardAction('No Coll Qty (Running)')
          }
        }}
      >
        <div className="card-header-row">
          <div className="card-title">No Coll Qty (Running)</div>
          <CardActionButton />
        </div>
        <div className="card-content">
          <div className="card-row">
            <span className="card-label">Quantity:</span>
            <span className="card-value">{formatValue(branchData['No Coll Running Month'])}</span>
          </div>
          {partiesValue && partiesValue.trim() !== '' && (
            <div className="card-row text-row">
              <span className="card-label">Parties:</span>
              <div 
                className="card-value text-value collapsible-parties"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleParties('No Coll Qty (Running)')
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    toggleParties('No Coll Qty (Running)')
                  }
                }}
              >
                <span className="parties-toggle-icon">
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span>{formattedParties}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const render3MonthNoCollCard = (branchData) => {
    const partiesValue = branchData['3 Month No Coll Qty List']
    const isExpanded = expandedParties['3 Month No Coll']
    const formattedParties = formatValue(partiesValue, 'text', isExpanded)
    
    return (
      <div 
        key="3-month-no-coll" 
        className="collection-metric-card"
        onClick={() => handleCardAction('3 Month No Coll')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardAction('3 Month No Coll')
          }
        }}
      >
        <div className="card-header-row">
          <div className="card-title">3 Month No Coll</div>
          <CardActionButton />
        </div>
        <div className="card-content">
          <div className="card-row">
            <span className="card-label">Quantity:</span>
            <span className="card-value">{formatValue(branchData['3 Month No Coll'])}</span>
          </div>
          <div className="card-row">
            <span className="card-label">Collected Running:</span>
            <span className="card-value">{formatValue(branchData['Coll 3 Month No Coll Qty'])}</span>
          </div>
          {partiesValue && partiesValue.trim() !== '' && (
            <div className="card-row text-row">
              <span className="card-label">Parties:</span>
              <div 
                className="card-value text-value collapsible-parties"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleParties('3 Month No Coll')
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    toggleParties('3 Month No Coll')
                  }
                }}
              >
                <span className="parties-toggle-icon">
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span>{formattedParties}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const render1YearNoCollCard = (branchData) => {
    const partiesValue = branchData['1 Year No Coll Qty List']
    const isExpanded = expandedParties['1 Year No Coll']
    const formattedParties = formatValue(partiesValue, 'text', isExpanded)
    
    return (
      <div 
        key="1-year-no-coll" 
        className="collection-metric-card"
        onClick={() => handleCardAction('1 Year No Coll')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardAction('1 Year No Coll')
          }
        }}
      >
        <div className="card-header-row">
          <div className="card-title">1 Year No Coll</div>
          <CardActionButton />
        </div>
        <div className="card-content">
          <div className="card-row">
            <span className="card-label">Quantity:</span>
            <span className="card-value">{formatValue(branchData['1 Year No Coll'])}</span>
          </div>
          <div className="card-row">
            <span className="card-label">Collected Running:</span>
            <span className="card-value">{formatValue(branchData['Coll 1 Year No Coll Qty'])}</span>
          </div>
          {partiesValue && partiesValue.trim() !== '' && (
            <div className="card-row text-row">
              <span className="card-label">Parties:</span>
              <div 
                className="card-value text-value collapsible-parties"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleParties('1 Year No Coll')
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    toggleParties('1 Year No Coll')
                  }
                }}
              >
                <span className="parties-toggle-icon">
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span>{formattedParties}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCards = (branchData) => {
    const cards = []
    const filteredColumns = columns.filter(col => {
      // Exclude grouped columns
      if (groupedColumns.includes(col)) return false
      // Exclude specific cards
      if (col === 'Corpoate Due' || col === 'Total Sale' || col === 'Total Coll' || col === 'Party Qty') return false
      // Exclude any column that contains these patterns (case-insensitive)
      const colLower = col.toLowerCase()
      if (colLower.includes('qty list') || colLower.includes('party list')) return false
      return true
    })
    
    // Add Party Qty grouped card first
    if (columns.includes('Party Qty')) {
      cards.push(renderPartyQtyCard(branchData))
    }
    
    // Add Corporate Due grouped card
    if (columns.includes('Corpoate Due')) {
      cards.push(renderCorporateDueCard(branchData))
    }
    
    // Add Total Sale grouped card
    if (columns.includes('Total Sale')) {
      cards.push(renderTotalSaleCard(branchData))
    }
    
    // Add Total Coll grouped card
    if (columns.includes('Total Coll')) {
      cards.push(renderTotalCollCard(branchData))
    }
    
    // Add 3 Month No Coll card
    if (columns.includes('3 Month No Coll')) {
      cards.push(render3MonthNoCollCard(branchData))
    }
    
    // Add 1 Year No Coll card
    if (columns.includes('1 Year No Coll')) {
      cards.push(render1YearNoCollCard(branchData))
    }
    
    // Add No Coll Qty (Running) card
    if (columns.includes('No Coll Running Month')) {
      cards.push(renderNoCollRunningCard(branchData))
    }
    
    // Add remaining individual cards
    filteredColumns.forEach(col => {
      cards.push(renderMetricCard(col, branchData[col]))
    })
    
    return cards
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
              <div className="branch-subtitle">Corporate Overview Metrics</div>
            </div>

            <div className="collection-cards-grid">
              {renderCards(calculateAllBranchesData())}
            </div>
          </div>
          <ScreenshotButton 
            targetRef={detailsRef} 
            fileName="all-branches-corporate-report"
          />
        </>
      ) : selectedBranch && (
        <>
          <div className="branch-details" ref={detailsRef}>
            <div className="branch-header">
              <h2>{selectedBranch['Branch Name']}</h2>
              <div className="branch-subtitle">Corporate Overview Metrics</div>
            </div>

            <div className="collection-cards-grid">
              {renderCards(selectedBranch)}
            </div>
          </div>
          <ScreenshotButton 
            targetRef={detailsRef} 
            fileName={`${selectedBranch['Branch Name'].replace(/\s+/g, '-')}-corporate-report`}
          />
        </>
      )}
    </div>
    </>
  )
}

export default CorporateOverview
