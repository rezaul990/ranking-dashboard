import * as XLSX from 'xlsx'

export const generatePlazaExcel = async (data) => {
  try {
    if (!data || data.length === 0) {
      alert('No data available to generate Excel')
      return
    }

    // Group data by Plaza Name
    const plazaGroups = {}
    data.forEach(branch => {
      const plaza = branch['Plaza Name'] || 'Unknown Plaza'
      if (!plazaGroups[plaza]) {
        plazaGroups[plaza] = []
      }
      plazaGroups[plaza].push(branch)
    })

    // Get all unique column names from data
    const allColumns = data.length > 0 ? Object.keys(data[0]) : []
    const dataColumns = allColumns.filter(col => 
      col !== 'Branch Name' && col !== 'Plaza Name' && col !== 'S/N'
    )

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Add each plaza as a sheet
    Object.entries(plazaGroups).forEach(([plaza, branches]) => {
      const plazaTotals = calculatePlazaTotals(branches, dataColumns)

      // Prepare sheet data
      const sheetData = []

      // Add title
      sheetData.push([`${plaza} - Dealer Overview`])
      sheetData.push([])

      // Add headers
      const headers = ['Branch Name', ...dataColumns]
      sheetData.push(headers)

      // Add branch rows
      branches.forEach(branch => {
        const row = [branch['Branch Name'] || 'N/A']
        dataColumns.forEach(col => {
          row.push(branch[col] || '0')
        })
        sheetData.push(row)
      })

      // Add totals row
      const totalsRow = ['TOTAL']
      dataColumns.forEach(col => {
        totalsRow.push(plazaTotals[col] || 0)
      })
      sheetData.push(totalsRow)

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

      // Set column widths
      const colWidths = [20, ...dataColumns.map(() => 15)]
      worksheet['!cols'] = colWidths.map(width => ({ wch: width }))

      // Style header row (row 3 - after title and blank row)
      const headerRowIndex = 2
      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: i })
        if (!worksheet[cellRef]) worksheet[cellRef] = {}
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: 'FF2C3E50' } },
          font: { bold: true, color: { rgb: 'FFFFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      }

      // Style totals row
      const totalsRowIndex = sheetData.length - 1
      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: totalsRowIndex, c: i })
        if (!worksheet[cellRef]) worksheet[cellRef] = {}
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: 'FFF5F5F5' } },
          font: { bold: true },
          alignment: { horizontal: 'right' }
        }
      }

      // Add worksheet to workbook
      const sheetName = plaza.substring(0, 31) // Excel sheet name limit is 31 characters
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    })

    // Create summary sheet
    const summaryData = []
    summaryData.push(['Plaza Name wise Dealer Overview'])
    summaryData.push([`Generated on ${new Date().toLocaleDateString()}`])
    summaryData.push([])
    summaryData.push(['Plaza Name', 'Total Branches', 'Total Dealers'])

    Object.entries(plazaGroups).forEach(([plaza, branches]) => {
      const totalDealers = branches.reduce((sum, b) => {
        const val = parseValue(b['Dealer Qty'] || 0)
        return sum + val
      }, 0)
      summaryData.push([plaza, branches.length, totalDealers])
    })

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Write file
    XLSX.writeFile(workbook, 'Plaza_Overview_Report.xlsx')
  } catch (error) {
    console.error('Error generating Excel:', error)
    alert('Failed to generate Excel. Please try again.')
  }
}

const calculatePlazaTotals = (branches, columns) => {
  const totals = {}
  
  columns.forEach(col => {
    totals[col] = branches.reduce((sum, branch) => {
      const val = parseValue(branch[col] || 0)
      return sum + val
    }, 0)
  })
  
  return totals
}

const parseValue = (val) => {
  const str = String(val || 0).replace(/,/g, '').replace(/[^\d.-]/g, '')
  return parseFloat(str) || 0
}
