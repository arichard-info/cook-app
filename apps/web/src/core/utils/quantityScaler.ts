const QTY_SPAN_RE = /<span\s+data-qty="([^"]+)"\s+data-unit="([^"]+)">([^<]*)<\/span>/g

/**
 * Returns a copy of `html` with all scalable quantity spans updated
 * to reflect the given scale factor.
 */
export const scaleHtml = (html: string, scale: number): string => {
  if (scale === 1) return html
  return html.replace(QTY_SPAN_RE, (_, qty, unit, displayText) => {
    const scaled = parseFloat(qty) * scale
    const newDisplay = buildDisplay(scaled, unit, displayText)
    // Keep original data-qty so re-scaling always works from base value
    return `<span data-qty="${qty}" data-unit="${unit}">${newDisplay}</span>`
  })
}

/**
 * Returns true if any of the provided HTML strings contain at least
 * one scalable quantity span.
 */
export const hasScalableQuantities = (strings: string[]): boolean => {
  return strings.some(s => /data-qty=/.test(s))
}

const buildDisplay = (scaled: number, unit: string, originalDisplay: string): string => {
  if (unit === 'count') {
    // Strip leading numeric chars (digits, spaces, fractions, slashes, dashes)
    // to isolate the item label (e.g. " œufs", " oignons")
    const label = originalDisplay.replace(/^[0-9\s.,½¼¾⅓⅔⅛⅜⅝⅞/-]+/, '')
    return `${formatCount(scaled)}${label}`
  }

  // For mass/volume units: strip leading digits to preserve the unit suffix
  // e.g. "300g" → suffix "g", "1.5L" → suffix "L", "10 cl" → suffix " cl"
  const suffix = originalDisplay.replace(/^[0-9.,]+/, '')
  return `${formatDecimal(scaled)}${suffix}`
}

/**
 * Formats a count value.
 * Exact integers → "3"
 * Half values → "2-3" range
 * Other decimals → rounded to nearest integer
 */
const formatCount = (value: number): string => {
  const lower = Math.floor(value)
  const upper = Math.ceil(value)
  if (lower !== upper) return `${lower}-${upper}`
  return `${lower}`
}

/**
 * Formats a decimal quantity with at most 1 decimal place.
 * Trailing zeros are removed (133.0 → "133", 1.5 → "1.5").
 */
const formatDecimal = (value: number): string => {
  const rounded = Math.round(value * 10) / 10
  return rounded % 1 === 0 ? `${Math.round(rounded)}` : `${rounded}`
}
