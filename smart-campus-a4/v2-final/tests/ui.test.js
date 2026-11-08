// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";

const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const $ = (id) => document.getElementById(id);

beforeEach(async () => {
  vi.resetModules();
  document.body.innerHTML = '<div id="app"></div>';
  await import("../main.js");
});

describe("UI behaviour", () => {
  it("F4 shows a clear empty state when no rooms match", () => {
    $("attendees").value = "500";
    fire($("attendees"), "input");
    expect($("emptyState").hidden).toBe(false);
    expect($("roomSelect").options.length).toBe(0);
    expect($("checkBtn").disabled).toBe(true);
  });

  it("F5 changing the selected room refreshes the result", () => {
    $("startInput").value = "12:00";
    $("endInput").value = "13:00";
    $("roomSelect").value = "B-204";
    fire($("roomSelect"), "change");
    fire($("checkForm"), "submit");
    expect($("result").textContent).toContain("Available");
    expect($("result").className).toContain("ok");

    $("roomSelect").value = "C-310";
    fire($("roomSelect"), "change");
    expect($("result").textContent).toContain("Unavailable");
    expect($("result").textContent).toContain("12:00–13:30");
    expect($("roomName").textContent).toBe("C-310 (Computer lab)");
  });

  it("filter list shows only matching rooms", () => {
    document.querySelector('input[value="computers"]').checked = true;
    fire(document.querySelector('input[value="computers"]'), "change");
    const options = [...$("roomSelect").options].map((o) => o.value);
    expect(options).toEqual(["C-310"]);
  });
});
