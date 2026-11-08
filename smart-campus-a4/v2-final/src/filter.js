// F1: capacity >= attendees. F2: room has ALL required equipment.
// Blocked rooms are not removed here; F3 is enforced by explainAvailability ("blocked").
export function filterRooms(rooms, { attendees = 0, equipment = [] } = {}) {
  const need = Number(attendees) || 0
  return rooms.filter(
    (room) => room.capacity >= need && equipment.every((item) => room.equipment.includes(item)),
  )
}
