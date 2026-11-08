// Time helpers shared by data, rules and UI. Times are ms since midnight.
export const MS_PER_MIN = 60000

export const at = (h, m = 0) => (h * 60 + m) * MS_PER_MIN

// "HH:MM" -> minutes, or null if the value is not a valid time
export const toMinutes = (t) => {
  if (!/^\d{1,2}:\d{2}$/.test(t)) return null
  const [h, m] = t.split(':').map(Number)
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

// minutes -> "HH:MM"
export const fmt = (m) => {
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export const fmtMs = (ms) => fmt(ms / MS_PER_MIN)
