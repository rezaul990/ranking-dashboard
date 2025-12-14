import { useState, useEffect, useRef } from 'react'
import KPICard from '../components/KPICard'
import BranchTable from '../components/BranchTable'
import ScreenshotButton from '../components/ScreenshotButton'
import { parseCSV, calculateKPIs } from '../utils/dataUtils'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBMgoqCsNi4oAnvtFsSMEdxLLy1mdwFXLehQ2ZfjdHwHQq2mHGb0283g76EneTkFvKuvN8SPC9dll/pub?output=csv'

function Dashboard() {
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
      setKpis(calculateKPIs(parsed))
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div ref={dashboardRef}>
        {loading && <div className="loading">Loading data...</div>}
        {error && <div className="error">{error}</div>}

        {kpis && (
          <div className="kpi-row">
            <KPICard title="Total Target" value={kpis.totalTarget} subtitle="All Branches" />
            <KPICard title="Total Ach" value={kpis.totalAch} subtitle={`${kpis.totalPct}%`} subtitleClass={kpis.totalPct >= 80 ? 'warn' : 'bad'} />
            <KPICard title="Retail %" value={`${kpis.retailPct}%`} valueClass={kpis.retailPct >= 100 ? 'good' : kpis.retailPct >= 80 ? 'warn' : 'bad'} />
            <KPICard title="Hire %" value={`${kpis.hirePct}%`} valueClass={kpis.hirePct >= 100 ? 'good' : kpis.hirePct >= 80 ? 'warn' : 'bad'} />
            <KPICard title="Profit %" value={`${kpis.profitPct}%`} valueClass={kpis.profitPct >= 100 ? 'good' : kpis.profitPct >= 80 ? 'warn' : 'bad'} />
          </div>
        )}

        {!loading && <BranchTable data={data} />}
      </div>
      
      {!loading && !error && (
        <ScreenshotButton 
          targetRef={dashboardRef} 
          fileName="all-branches-dashboard"
        />
      )}
    </>
  )
}

export default Dashboard
