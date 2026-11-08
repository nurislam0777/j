import './style.css'
import { explainAvailability, overlaps, MAX_MINUTES } from './src/availability.js'

const ROOM = 'B-204 (Seminar room)'
const NOW = 540 // 09:00
const MIN = 60000 // minutes -> ms, availability.js works with ms
const ROOM_ID = 'B-204'
const EXISTING_BOOKINGS = [{ id: 'B1', roomId: ROOM_ID, start: 10 * 60 * MIN, end: 11 * 60 * MIN }]

const fmt = (m) => {
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

const toMinutes = (t) => {
  if (!/^\d{1,2}:\d{2}$/.test(t)) return null
  const [h, m] = t.split(':').map(Number)
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

const REJECTION_MESSAGES = {
  invalidRange: 'End time must be later than the start time.',
  past: `Start time cannot be in the past (now is ${fmt(NOW)}).`,
  tooLong: `Bookings can be no longer than ${MAX_MINUTES} minutes.`,
  blocked: 'This room is currently blocked.',
}

document.querySelector('#app').innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>Smart Campus Room Availability Checker</h1>
      <p class="sub">Choose a start and end time from 09:00.</p>
    </header>

    <section class="card room-card">
      <div class="room-head">
        <span class="room-icon" aria-hidden="true">📍</span>
        <div>
          <h2 id="roomName">${ROOM}</h2>
          <p class="now">Current time: <strong>${fmt(NOW)}</strong></p>
        </div>
      </div>

      <div class="bookings">
        <h3>Existing bookings today</h3>
        <ul id="bookingList"></ul>
      </div>

      <label class="block-toggle">
        <input type="checkbox" id="blocked" />
        <span>Room is blocked</span>
      </label>
    </section>

    <section class="card form-card">
      <h3>Check a time slot</h3>
      <form id="checkForm" novalidate>
        <div class="fields">
          <label class="field">
            <span>Start time</span>
            <input type="time" id="startInput" required />
          </label>
          <label class="field">
            <span>End time</span>
            <input type="time" id="endInput" required />
          </label>
        </div>
        <button type="submit" id="checkBtn">Check availability</button>
      </form>

      <div id="result" class="result" hidden></div>
      <ul id="errors" class="errors" hidden></ul>
    </section>

    <footer class="foot">Times run from 00:00 to 24:00. Endpoint-touching slots do not overlap.</footer>
  </main>
`

document.getElementById('bookingList').innerHTML =
  EXISTING_BOOKINGS.map((b) => `<li><span>${fmt(b.start / MIN)} – ${fmt(b.end / MIN)}</span></li>`).join('')

const form = document.getElementById('checkForm')
const startInput = document.getElementById('startInput')
const endInput = document.getElementById('endInput')
const blockedInput = document.getElementById('blocked')
const result = document.getElementById('result')
const errors = document.getElementById('errors')

const showErrors = (msgs) => {
  errors.hidden = false
  errors.innerHTML = msgs.map((m) => `<li>${m}</li>`).join('')
}
const showResult = (available, msg) => {
  result.hidden = false
  result.className = `result ${available ? 'ok' : 'no'}`
  result.innerHTML = `<strong>${available ? 'Available' : 'Unavailable'}</strong><p>${msg}</p>`
}
const clearOutput = () => {
  result.hidden = true
  errors.hidden = true
}

const formatTime = (m) => fmt(m)
const timeToMinutes = (t) => toMinutes(t)

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!startInput.value || !endInput.value) {
    showResult(false, 'Enter both a start time and an end time.')
    return
  }
  const start = timeToMinutes(startInput.value)
  const end = timeToMinutes(endInput.value)
  const room = { id: ROOM_ID, blocked: blockedInput.checked }
  const startMs = start * MIN
  const endMs = end * MIN

  // decision and reason both come only from the tested function
  const reason = explainAvailability(room, EXISTING_BOOKINGS, startMs, endMs, NOW * MIN)

  if (reason === null) {
    showResult(true, `${formatTime(start)}–${formatTime(end)} is free to use.`)
    return
  }
  if (reason === 'overlap') {
    const conflict = EXISTING_BOOKINGS.find(
      (b) => b.roomId === room.id && overlaps(startMs, endMs, b.start, b.end),
    )
    showResult(false, `That time overlaps with the ${fmt(conflict.start / MIN)}–${fmt(conflict.end / MIN)} booking.`)
    return
  }
  showResult(false, REJECTION_MESSAGES[reason])
})
