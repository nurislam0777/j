// Smart Campus - room availability (FIXED VERSION)
export const MAX_MINUTES = 120;

export function overlaps(aStart, aEnd, bStart, bEnd) {
  // FIX-A: strict < so touching endpoints are not a conflict
  return aStart < bEnd && bStart < aEnd;
}

export function explainAvailability(room, bookings, start, end, now) {
  if (start >= end) return "invalidRange";
  if (start < now) return "past";
  if ((end - start) / 60000 > MAX_MINUTES) return "tooLong";
  if (room.blocked) return "blocked";

  // FIX-B: copy the array before sorting, original stays the same
  const sorted = [...bookings].sort((a, b) => a.start - b.start);
  for (const b of sorted) {
    if (b.roomId === room.id && overlaps(start, end, b.start, b.end)) {
      return "overlap";
    }
  }
  return null;
}

export function checkAvailability(room, bookings, start, end, now) {
  return explainAvailability(room, bookings, start, end, now) === null ? "Available" : "Unavailable";
}
