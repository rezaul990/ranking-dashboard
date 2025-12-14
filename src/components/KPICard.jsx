import './KPICard.css'

function KPICard({ title, value, subtitle, valueClass = '', subtitleClass = '' }) {
  return (
    <div className="kpi">
      <h3>{title}</h3>
      <div className={`value ${valueClass}`}>{value}</div>
      {subtitle && <div className={`small ${subtitleClass}`}>{subtitle}</div>}
    </div>
  )
}

export default KPICard
