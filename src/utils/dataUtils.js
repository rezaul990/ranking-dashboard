export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = parseCSVLine(lines[0])
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj = {}
    headers.forEach((header, i) => {
      obj[header.trim()] = (values[i] || '').trim()
    })
    return obj
  }).filter(row => row['Branch Name']) // Filter out empty rows
}

export function extractUpdateDate(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length === 0) return null
  
  const headers = parseCSVLine(lines[0])
  // AN is the 40th column (A=1, B=2, ... Z=26, AA=27, ... AN=40)
  const updateDateIndex = 39 // 0-indexed, so AN = 39
  
  if (headers.length > updateDateIndex) {
    return headers[updateDateIndex] || null
  }
  
  return null
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  
  return result
}

export function formatNumber(value) {
  const cleaned = String(value || 0).replace(/,/g, '')
  return Number(cleaned || 0).toLocaleString('en-IN')
}

export function calculatePercentage(target, achievement) {
  const t = Number(String(target || 0).replace(/,/g, ''))
  const a = Number(String(achievement || 0).replace(/,/g, ''))
  return t ? Math.round((a / t) * 100) : 0
}

export function getPercentageClass(percentage) {
  if (percentage >= 100) return 'good'
  if (percentage >= 80) return 'warn'
  return 'bad'
}

export function calculateKPIs(data) {
  let totalTarget = 0
  let totalAch = 0
  let retailTarget = 0
  let retailAch = 0
  let hireTarget = 0
  let hireAch = 0
  let profitTarget = 0
  let profitAch = 0

  data.forEach(row => {
    totalTarget += Number(String(row['Total Target'] || 0).replace(/,/g, ''))
    totalAch += Number(String(row['Total Ach'] || 0).replace(/,/g, ''))
    retailTarget += Number(String(row['Retail Target'] || 0).replace(/,/g, ''))
    retailAch += Number(String(row['Retial Ach'] || 0).replace(/,/g, ''))
    hireTarget += Number(String(row['Hire Target'] || 0).replace(/,/g, ''))
    hireAch += Number(String(row['Hire Ach'] || 0).replace(/,/g, ''))
    profitTarget += Number(String(row['Profit Target'] || 0).replace(/,/g, ''))
    profitAch += Number(String(row['Profit Ach'] || 0).replace(/,/g, ''))
  })

  return {
    totalTarget: `৳ ${(totalTarget / 10000000).toFixed(1)} Cr`,
    totalAch: `৳ ${(totalAch / 10000000).toFixed(1)} Cr`,
    totalPct: calculatePercentage(totalTarget, totalAch),
    retailPct: calculatePercentage(retailTarget, retailAch),
    hirePct: calculatePercentage(hireTarget, hireAch),
    profitPct: calculatePercentage(profitTarget, profitAch)
  }
}
