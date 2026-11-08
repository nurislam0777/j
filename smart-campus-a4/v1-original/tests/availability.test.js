import { describe, it, expect } from "vitest";
import { checkAvailability, explainAvailability } from "../src/availability.js";

const t = (h, m = 0) => new Date(2026, 9, 27, h, m).getTime();
const NOW = t(8);
const room = { id: "R101", blocked: false };
const fresh = () => [
  { id: "B2", roomId: "R101", start: t(13), end: t(14) },
  { id: "B1", roomId: "R101", start: t(10), end: t(11) },
];

describe("Room availability", () => {
  it("TC01 start >= end is rejected (AC1)", () => {
    expect(checkAvailability(room, fresh(), t(12), t(12), NOW)).toBe("Unavailable");
  });
  it("TC02 request in the past is rejected (AC1)", () => {
    expect(checkAvailability(room, fresh(), t(7), t(7, 30), NOW)).toBe("Unavailable");
  });
  it("TC03 exactly 120 minutes is allowed (AC2)", () => {
    expect(checkAvailability(room, [], t(15), t(17), NOW)).toBe("Available");
  });
  it("TC04 121 minutes is rejected (AC2)", () => {
    expect(checkAvailability(room, [], t(15), t(17, 1), NOW)).toBe("Unavailable");
  });
  it("TC05 blocked room is rejected (AC3)", () => {
    expect(checkAvailability({ id: "R101", blocked: true }, [], t(15), t(16), NOW)).toBe("Unavailable");
  });
  it("TC06 real overlap is rejected (AC4)", () => {
    expect(checkAvailability(room, fresh(), t(10, 30), t(11, 30), NOW)).toBe("Unavailable");
  });
  it("TC07 booking that ends when another starts is allowed (AC4)", () => {
    expect(checkAvailability(room, fresh(), t(9), t(10), NOW)).toBe("Available");
  });
  it("TC08 booking that starts when another ends is allowed (AC4)", () => {
    expect(checkAvailability(room, fresh(), t(11), t(12), NOW)).toBe("Available");
  });
  it("TC09 free slot returns Available (AC5)", () => {
    expect(checkAvailability(room, fresh(), t(15), t(16), NOW)).toBe("Available");
  });
  it("TC10 bookings array is not changed (AC5)", () => {
    const data = fresh();
    const copy = JSON.parse(JSON.stringify(data));
    checkAvailability(room, data, t(15), t(16), NOW);
    expect(data).toEqual(copy);
  });
});

describe("Rejection reasons", () => {
  it("returns invalidRange when end is not after start (AC1)", () => {
    expect(explainAvailability(room, fresh(), t(12), t(11), NOW)).toBe("invalidRange");
  });
  it("returns past for a start before now (AC1)", () => {
    expect(explainAvailability(room, fresh(), t(7), t(7, 30), NOW)).toBe("past");
  });
  it("returns tooLong for 121 minutes (AC2)", () => {
    expect(explainAvailability(room, [], t(15), t(17, 1), NOW)).toBe("tooLong");
  });
  it("returns blocked for a blocked room (AC3)", () => {
    expect(explainAvailability({ id: "R101", blocked: true }, [], t(15), t(16), NOW)).toBe("blocked");
  });
  it("returns overlap for a real conflict (AC4)", () => {
    expect(explainAvailability(room, fresh(), t(10, 30), t(11, 30), NOW)).toBe("overlap");
  });
  it("returns null for an available slot (AC5)", () => {
    expect(explainAvailability(room, fresh(), t(11), t(12), NOW)).toBe(null);
  });
  it("reports the first failing rule when several fail (AC1 before AC3)", () => {
    expect(explainAvailability({ id: "R101", blocked: true }, fresh(), t(7), t(7, 30), NOW)).toBe("past");
  });
});

describe("Regression edges", () => {
  it("reversed interval is rejected by checkAvailability (AC1)", () => {
    expect(checkAvailability(room, [], t(12), t(11), NOW)).toBe("Unavailable");
  });
  it("exactly 120 minutes returns null from explainAvailability (AC2)", () => {
    expect(explainAvailability(room, [], t(15), t(17), NOW)).toBe(null);
  });
  it("slot ending exactly when a booking starts is not an overlap (AC4)", () => {
    expect(explainAvailability(room, fresh(), t(9), t(10), NOW)).toBe(null);
  });
  it("slot starting exactly when a booking ends is not an overlap (AC4)", () => {
    expect(explainAvailability(room, fresh(), t(11), t(12), NOW)).toBe(null);
  });
  it("explainAvailability does not change the bookings array on the overlap path (AC5)", () => {
    const data = fresh();
    const copy = JSON.parse(JSON.stringify(data));
    explainAvailability(room, data, t(10, 30), t(11, 30), NOW);
    expect(data).toEqual(copy);
  });
});
