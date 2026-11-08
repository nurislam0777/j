import './style.css'
import './src/ui/catalog.css'
import { explainRoom, findConflict, MAX_MINUTES } from './src/availability.js'
import { filterRooms } from './src/filter.js'
import { ROOMS, NOW, EQUIPMENT } from './src/data/rooms.js'
import { toMinutes, fmtMs, MS_PER_MIN } from './src/time.js'
import { renderShell, renderRoomOptions, renderRoom, showResult, hideResult, slotLabel } from './src/ui/render.js'

const REJECTION_MESSAGES = {
  invalidRange: 'End time must be later than the start time.',
  past: `Start time cannot be in the past (now is ${fmtMs(NOW)}).`,
  tooLong: `Bookings can be no longer than ${MAX_MINUTES} minutes.`,
  blocked: 'This room is currently blocked.',
}

renderShell(document.querySelector('#app'), { now: NOW, equipment: EQUIPMENT })

const $ = (id) => document.getElementById(id)
const form = $('checkForm')
const select = $('roomSelect')
const result = $('result')
const state = { visible: ROOMS, selectedId: ROOMS[0].id, checked: false }

const selectedRoom = () => state.visible.find((r) => r.id === state.selectedId) || null

function check() {
  const room = selectedRoom()
  if (!room) return hideResult(result)
  if (!$('startInput').value || !$('endInput').value) {
    return showResult(result, false, 'Enter both a start time and an end time.')
  }
  const start = toMinutes($('startInput').value)
  const end = toMinutes($('endInput').value)
  const startMs = start * MS_PER_MIN
  const endMs = end * MS_PER_MIN

  // decision and reason both come only from the tested function
  const reason = explainRoom(room, startMs, endMs, NOW)
  if (reason === null) return showResult(result, true, `${room.name}: ${slotLabel(start, end)} is free to use.`)
  if (reason === 'overlap') {
    const c = findConflict(room, room.bookings, startMs, endMs)
    return showResult(result, false, `${room.name}: that time overlaps with the ${fmtMs(c.start)}–${fmtMs(c.end)} booking.`)
  }
  return showResult(result, false, REJECTION_MESSAGES[reason])
}

// F5: every room change re-runs the check for the new room (or hides an old result)
function refresh() {
  renderRoom(document, selectedRoom())
  if (state.checked && selectedRoom()) check()
  else hideResult(result)
}

function applyFilters() {
  const equipment = [...document.querySelectorAll('input[name=equipment]:checked')].map((c) => c.value)
  state.visible = filterRooms(ROOMS, { attendees: $('attendees').value, equipment })
  if (!state.visible.some((r) => r.id === state.selectedId)) {
    state.selectedId = state.visible[0]?.id ?? null
  }
  renderRoomOptions(select, state.visible, state.selectedId)
  const none = state.visible.length === 0
  $('emptyState').hidden = !none // F4
  select.disabled = none
  $('checkBtn').disabled = none
  refresh()
}

$('attendees').addEventListener('input', applyFilters)
document.querySelectorAll('input[name=equipment]').forEach((c) => c.addEventListener('change', applyFilters))
select.addEventListener('change', () => { state.selectedId = select.value; refresh() })
form.addEventListener('submit', (event) => {
  event.preventDefault()
  state.checked = true
  check()
})

applyFilters()
