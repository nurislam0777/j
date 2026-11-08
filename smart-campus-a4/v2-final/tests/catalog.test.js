import { describe, it, expect } from "vitest";
import { ROOMS, NOW } from "../src/data/rooms.js";
import { filterRooms } from "../src/filter.js";
import { explainRoom, findConflict } from "../src/availability.js";
import { at } from "../src/time.js";

const ids = (rooms) => rooms.map((r) => r.id);
const byId = (id) => ROOMS.find((r) => r.id === id);

describe("Room catalog", () => {
  it("has at least four rooms with all required fields", () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    for (const r of ROOMS) {
      expect(typeof r.id).toBe("string");
      expect(typeof r.name).toBe("string");
      expect(typeof r.capacity).toBe("number");
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe("boolean");
      expect(r.bookings.every((b) => b.roomId === r.id)).toBe(true);
    }
  });
  it("catalog data can not be changed (AC5)", () => {
    const room = byId("B-204");
    expect(() => { room.bookings[0].start = 0; }).toThrow();
    expect(() => { room.bookings.push({}); }).toThrow();
    expect(() => { room.blocked = true; }).toThrow();
    expect(room.bookings[0].start).toBe(at(10));
  });
});

describe("Filtering F1-F2", () => {
  it("F1 exact capacity is included (24 attendees, C-310 has 24)", () => {
    expect(ids(filterRooms(ROOMS, { attendees: 24 }))).toContain("C-310");
  });
  it("F1 insufficient capacity is excluded (25 attendees)", () => {
    expect(ids(filterRooms(ROOMS, { attendees: 25 }))).not.toContain("C-310");
  });
  it("F2 room must contain ALL selected equipment", () => {
    expect(ids(filterRooms(ROOMS, { equipment: ["projector", "computers"] }))).toEqual(["C-310"]);
  });
  it("F2 room with only part of the equipment is excluded", () => {
    expect(ids(filterRooms(ROOMS, { equipment: ["whiteboard", "video-conf"] }))).not.toContain("B-204");
  });
  it("F1+F2 with no matching room returns an empty list", () => {
    expect(filterRooms(ROOMS, { attendees: 50, equipment: ["computers"] })).toEqual([]);
  });
});

describe("Availability per room F3", () => {
  it("F3 blocked room from the catalog is never available", () => {
    const hall = byId("A-101");
    expect(filterRooms(ROOMS, { attendees: 100 })).toContain(hall);
    expect(explainRoom(hall, at(15), at(16), NOW)).toBe("blocked");
  });
  it("check uses the chosen room's bookings, not another room's", () => {
    // 12:00-13:00 is busy in C-310 but free in B-204
    expect(explainRoom(byId("C-310"), at(12), at(13), NOW)).toBe("overlap");
    expect(explainRoom(byId("B-204"), at(12), at(13), NOW)).toBe(null);
  });
  it("findConflict returns the conflicting booking of the same room", () => {
    const c = findConflict(byId("C-310"), byId("C-310").bookings, at(13), at(14));
    expect(c.start).toBe(at(12));
    expect(findConflict(byId("B-204"), byId("C-310").bookings, at(13), at(14))).toBe(null);
  });
});
