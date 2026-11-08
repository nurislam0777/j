// Smart Campus - room availability (FIXED VERSION, extended for room catalog)
import { MS_PER_MIN } from './time.js'

export const MAX_MINUTES = 120;

export function overlaps(aStart, aEnd, bStart, bEnd) {
  // FIX-A: strict < so touching endpoints are not a conflict
  return aStart < bEnd && bStart < aEnd;
}

// First booking of THIS room that overlaps [start, end), or null.
export function findConflict(room, bookings, start, end) {
  // FIX-B: copy the array before sorting, original stays the same
  const sorted = [...bookings].sort((a, b) => a.start - b.start);
  return sorted.find((b) => b.roomId === room.id && overlaps(start, end, b.start, b.end)) || null;
}

export function explainAvailability(room, bookings, start, end, now) {
  if (start >= end) return "invalidRange";
  if (start < now) return "past";
  if ((end - start) / MS_PER_MIN > MAX_MINUTES) return "tooLong";
  if (room.blocked) return "blocked";
  if (findConflict(room, bookings, start, end)) return "overlap";
  return null;
}

export function checkAvailability(room, bookings, start, end, now) {
  return explainAvailability(room, bookings, start, end, now) === null ? "Available" : "Unavailable";
}

// Catalog room: always uses the room's own bookings.
export function explainRoom(room, start, end, now) {
  return explainAvailability(room, room.bookings, start, end, now);
}
