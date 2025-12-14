import React from 'react'
import './BranchTable.css'
import { formatNumber, calculatePercentage, getPercentageClass } from '../utils/dataUtils'

function BranchTable({ data }) {
  const renderCell = (target, achievement) => {
    const pct = calculatePercentage(target, achievement)
    return (
      <>
        <td>{formatNumber(target)}</td>
        <td>{formatNumber(achievement)}</td>
        <td className={getPercentageClass(pct)}>{pct}%</td>
      </>
    )
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Branch</th>
            <th className="group" colSpan="3">Total</th>
            <th className="group" colSpan="3">Retail</th>
            <th className="group" colSpan="3">Hire</th>
            <th className="group" colSpan="3">Hire DP</th>
            <th className="group" colSpan="3">INS / LPR</th>
            <th className="group" colSpan="3">Exec</th>
            <th className="group" colSpan="3">Self</th>
            <th className="group" colSpan="3">Dealer Sales</th>
            <th className="group" colSpan="3">Dealer Coll</th>
            <th className="group" colSpan="3">Profit</th>
          </tr>
          <tr>
            {Array(10).fill(null).map((_, i) => (
              <React.Fragment key={i}>
                <th>T</th>
                <th>A</th>
                <th>%</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row['Branch Name'] || row['Walton Plaza'] || row['Branch'] || ''}</td>
              {renderCell(row['Total Target'], row['Total Ach'])}
              {renderCell(row['Retail Target'], row['Retial Ach'])}
              {renderCell(row['Hire Target'], row['Hire Ach'])}
              {renderCell(row['Hire DP Target'], row['Hire DP Ach'])}
              {renderCell(row['INS or LPR Target'], row['INS or LPR Ach'])}
              {renderCell(row['Hire Collection Executive (Qty.) Target'], row['Hire Collection Executive (Qty.) Ach'])}
              {renderCell(row['Hire Collection Self (Qty.) Target'], row['Hire Collection Self (Qty.) Ach'])}
              {renderCell(row['Dealer & Corporate Sales Target'], row['Dealer & Corporate Sales Ach'])}
              {renderCell(row['Dealer & Corporate Collection Target'], row['Dealer & Corporate Collection Ach'])}
              {renderCell(row['Profit Target'], row['Profit Ach'])}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BranchTable
