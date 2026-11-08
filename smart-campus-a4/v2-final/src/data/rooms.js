// Fictional room catalog. Everything is deep-frozen so no code can change it (AC5).
import { at } from '../time.js'

const deepFreeze = (obj) => {
  Object.values(obj).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v) })
  return Object.freeze(obj)
}

export const NOW = at(9) // fixed current time 09:00

export const EQUIPMENT = deepFreeze([
  { id: 'projector', label: 'Projector' },
  { id: 'whiteboard', label: 'Whiteboard' },
  { id: 'computers', label: 'Computers' },
  { id: 'video-conf', label: 'Video conference' },
])

const room = (id, name, capacity, equipment, blocked, slots) => ({
  id, name, capacity, equipment, blocked,
  bookings: slots.map(([s, e], i) => ({ id: `${id}-${i + 1}`, roomId: id, start: s, end: e })),
})

export const ROOMS = deepFreeze([
  room('B-204', 'B-204 (Seminar room)', 30, ['projector', 'whiteboard'], false, [[at(10), at(11)]]),
  room('C-310', 'C-310 (Computer lab)', 24, ['projector', 'computers'], false, [[at(12), at(13, 30)]]),
  room('D-015', 'D-015 (Meeting room)', 8, ['whiteboard', 'video-conf'], false, [[at(9, 30), at(10)]]),
  room('A-101', 'A-101 (Lecture hall)', 120, ['projector', 'whiteboard', 'video-conf'], true, []),
  room('E-120', 'E-120 (Study room)', 4, ['whiteboard'], false, [[at(14), at(16)]]),
])
