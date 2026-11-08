// Smart Campus - room availability (BUGGY VERSION)
export const MAX_MINUTES = 120;

export function overlaps(aStart, aEnd, bStart, bEnd) {
  // BUG-A: <= / >= treat touching endpoints as conflict
  return aStart <= bEnd && bStart <= aEnd;
}

export function checkAvailability(room, bookings, start, end, now) {
  if (start >= end) return "Unavailable";
  if (start < now) return "Unavailable";
  if ((end - start) / 60000 > MAX_MINUTES) return "Unavailable";
  if (room.blocked) return "Unavailable";

  // BUG-B: sort() changes the original bookings array
  const sorted = bookings.sort((a, b) => a.start - b.start);
  for (const b of sorted) {
    if (b.roomId === room.id && overlaps(start, end, b.start, b.end)) {
      return "Unavailable";
    }
  }
  return "Available";
}
