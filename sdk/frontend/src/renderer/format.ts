export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function formatNumber(value: unknown, precision?: number): string {
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return formatValue(value)
  return precision !== undefined ? number.toFixed(precision) : number.toLocaleString()
}
