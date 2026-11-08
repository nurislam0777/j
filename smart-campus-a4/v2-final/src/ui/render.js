// Rendering only. No booking rules here.
import { fmt, fmtMs } from '../time.js'

export function renderShell(app, { now, equipment }) {
  app.innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>Smart Campus Room Availability Checker</h1>
      <p class="sub">Pick your requirements, choose a room and a time from 09:00.</p>
    </header>

    <section class="card filter-card">
      <h3>Requirements</h3>
      <label class="field">
        <span>Attendees</span>
        <input type="number" id="attendees" min="1" value="1" />
      </label>
      <fieldset class="equipment">
        <legend>Required equipment</legend>
        ${equipment.map((e) => `<label><input type="checkbox" name="equipment" value="${e.id}" /> ${e.label}</label>`).join('')}
      </fieldset>
      <label class="field">
        <span>Room</span>
        <select id="roomSelect"></select>
      </label>
      <p id="emptyState" class="empty" hidden>No rooms match these requirements. Try fewer attendees or less equipment.</p>
    </section>

    <section class="card room-card" id="roomCard">
      <div class="room-head">
        <span class="room-icon" aria-hidden="true">📍</span>
        <div>
          <h2 id="roomName"></h2>
          <p class="now">Current time: <strong>${fmtMs(now)}</strong></p>
          <p class="meta" id="roomMeta"></p>
        </div>
      </div>
      <div class="bookings">
        <h3>Existing bookings today</h3>
        <ul id="bookingList"></ul>
      </div>
      <p class="block-toggle" id="blockedBadge" hidden>Room is blocked</p>
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
    </section>

    <footer class="foot">Times run from 00:00 to 24:00. Endpoint-touching slots do not overlap.</footer>
  </main>`
}

export function renderRoomOptions(select, rooms, selectedId) {
  select.innerHTML = rooms
    .map((r) => `<option value="${r.id}"${r.id === selectedId ? ' selected' : ''}>${r.name} – ${r.capacity} seats${r.blocked ? ' (blocked)' : ''}</option>`)
    .join('')
}

export function renderRoom(doc, room) {
  doc.getElementById('roomCard').hidden = !room
  if (!room) return
  doc.getElementById('roomName').textContent = room.name
  doc.getElementById('roomMeta').textContent = `Capacity ${room.capacity} · ${room.equipment.join(', ')}`
  doc.getElementById('blockedBadge').hidden = !room.blocked
  doc.getElementById('bookingList').innerHTML = room.bookings.length
    ? room.bookings.map((b) => `<li><span>${fmtMs(b.start)} – ${fmtMs(b.end)}</span></li>`).join('')
    : '<li><span>No bookings</span></li>'
}

export function showResult(el, available, msg) {
  el.hidden = false
  el.className = `result ${available ? 'ok' : 'no'}`
  el.innerHTML = `<strong>${available ? 'Available' : 'Unavailable'}</strong><p>${msg}</p>`
}

export function hideResult(el) {
  el.hidden = true
}

export const slotLabel = (startMin, endMin) => `${fmt(startMin)}–${fmt(endMin)}`
