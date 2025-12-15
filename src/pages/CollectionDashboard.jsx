import { useState, useEffect, useRef } from 'react'
import KPICard from '../components/KPICard'
import ScreenshotButton from '../components/ScreenshotButton'
import { parseCSV, formatNumber } from '../utils/dataUtils'
import './CollectionDashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXc-G_Yb3upkVljn0pXdzHqV5dAPr-TW47o9uKy8qQNRkiknwZx7wgSLESLsckivRHS73dRN3UaWcm/pub?output=csv'

function CollectionDashboard() {
  const [data, setData] = useState([])
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dashboardRef = useRef(null)

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
      setKpis(calculateCollectionKPIs(parsed))
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateCollectionKPIs = (data) => {
    let totalHireOutstanding = 0
    let totalOverdueRunning = 0
    let totalCollectibleQty = 0
    let totalCollectedQty = 0
    let totalMaturedOverdueAmt = 0

    data.forEach(row => {
      totalHireOutstanding += parseFloat(String(row['Hire Outstanding'] || 0).replace(/,/g, '')) || 0
      totalOverdueRunning += parseFloat(String(row['Overdue Running Month'] || 0).replace(/,/g, '')) || 0
      totalCollectibleQty += parseInt(String(row['Collectible Qty'] || 0).replace(/,/g, '')) || 0
      totalCollectedQty += parseInt(String(row['Collected Qty'] || 0).replace(/,/g, '')) || 0
      totalMaturedOverdueAmt += parseFloat(String(row['Matured Overdue Amount'] || 0).replace(/,/g, '')) || 0
    })

    const collectionPct = totalCollectibleQty ? ((totalCollectedQty / totalCollectibleQty) * 100).toFixed(1) : 0
    const overduePct = totalHireOutstanding ? ((totalOverdueRunning / totalHireOutstanding) * 100).toFixed(1) : 0

    return {
      totalHireOutstanding: `৳ ${(totalHireOutstanding / 10000000).toFixed(2)} Cr`,
      totalOverdueRunning: `৳ ${(totalOverdueRunning / 10000000).toFixed(2)} Cr`,
      collectionPct: `${collectionPct}%`,
      overduePct: `${overduePct}%`,
      totalMaturedOverdueAmt: `৳ ${(totalMaturedOverdueAmt / 100000).toFixed(2)} L`
    }
  }

  const getOverdueClass = (pct) => {
    const value = parseFloat(pct)
    if (value < 10) return 'good'
    if (value < 20) return 'warn'
    return 'bad'
  }

  const getCollectionClass = (pct) => {
    const value = parseFloat(pct)
    if (value >= 30) return 'good'
    if (value >= 20) return 'warn'
    return 'bad'
  }

  return (
    <>
      <div ref={dashboardRef}>
        {loading && <div className="loading">Loading data...</div>}
        {error && <div className="error">{error}</div>}

        {kpis && (
          <div className="kpi-row">
            <KPICard 
              title="Total Hire Outstanding" 
              value={kpis.totalHireOutstanding} 
              subtitle="All Branches" 
            />
            <KPICard 
              title="Total Overdue" 
              value={kpis.totalOverdueRunning} 
              subtitle={kpis.overduePct}
              subtitleClass={getOverdueClass(kpis.overduePct)}
            />
            <KPICard 
              title="Collection Rate" 
              value={kpis.collectionPct}
              valueClass={getCollectionClass(kpis.collectionPct)}
            />
            <KPICard 
              title="Matured Overdue" 
              value={kpis.totalMaturedOverdueAmt}
              valueClass="warn"
            />
          </div>
        )}

        {!loading && (
          <div className="card">
            <div className="table-wrapper">
              <table className="collection-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Branch Name</th>
                    <th rowSpan="2">Hire Outstanding</th>
                    <th rowSpan="2">Running AC<br/>(Collectible)</th>
                    <th rowSpan="2">Running AC<br/>(POS)</th>
                    <th colSpan="3" className="group">Overdue</th>
                    <th colSpan="3" className="group">Collection</th>
                    <th colSpan="2" className="group">Mobile Overdue</th>
                    <th colSpan="2" className="group">2024 Overdue</th>
                    <th colSpan="2" className="group">2025 Overdue</th>
                    <th rowSpan="2">3+ Month<br/>No Coll</th>
                    <th colSpan="2" className="group">Matured Overdue</th>
                  </tr>
                  <tr>
                    <th>Prev Month</th>
                    <th>Running</th>
                    <th>%</th>
                    <th>Collectible</th>
                    <th>Collected</th>
                    <th>%</th>
                    <th>Prev</th>
                    <th>Running</th>
                    <th>Prev</th>
                    <th>Running</th>
                    <th>Prev</th>
                    <th>Running</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => {
                    const collectionPct = parseFloat(String(row['Collection Qty %'] || '0%').replace('%', ''))
                    const overduePct = parseFloat(String(row['Overdue %'] || '0%').replace('%', ''))
                    
                    return (
                      <tr key={idx}>
                        <td className="branch-name">{row['Branch Name']}</td>
                        <td className="number">{formatNumber(row['Hire Outstanding'])}</td>
                        <td className="number">{formatNumber(row['Running AC (Collectilbe)'])}</td>
                        <td className="number">{formatNumber(row['Running AC (POS)'])}</td>
                        <td className="number">{formatNumber(row['Overdue Previous Month'])}</td>
                        <td className="number">{formatNumber(row['Overdue Running Month'])}</td>
                        <td className={getOverdueClass(overduePct)}>{row['Overdue %']}</td>
                        <td className="number">{formatNumber(row['Collectible Qty'])}</td>
                        <td className="number">{formatNumber(row['Collected Qty'])}</td>
                        <td className={getCollectionClass(collectionPct)}>{row['Collection Qty %']}</td>
                        <td className="number">{formatNumber(row['Mobile Overdue Previous Month'])}</td>
                        <td className="number">{formatNumber(row['Mobile Overdue Running Month'])}</td>
                        <td className="number">{formatNumber(row['2024 Overdue Previous Month'])}</td>
                        <td className="number">{formatNumber(row['2024 Overdue Running Month'])}</td>
                        <td className="number">{formatNumber(row['2025 Overdue Previous Month'])}</td>
                        <td className="number">{formatNumber(row['2025 Overdue Running Month'])}</td>
                        <td className="number">{formatNumber(row['3+ Month No Coll'])}</td>
                        <td className="number">{formatNumber(row['Matured Overdue Qty'])}</td>
                        <td className="number">{formatNumber(row['Matured Overdue Amount'])}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {!loading && !error && (
        <ScreenshotButton 
          targetRef={dashboardRef} 
          fileName="collection-overdue-dashboard"
        />
      )}
    </>
  )
}

export default CollectionDashboard
