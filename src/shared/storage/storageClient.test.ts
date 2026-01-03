import { describe, it, expect, beforeEach } from "vitest";
import { getItem, removeItem, setItem } from "./storageClient";

describe("storageClient", () => {
  const key = "test-key";

  const state = {
    habits: [
      {
        id: "h1",
        name: "Drink water",
        createdAt: "2025-12-27",
        archived: false,
      },
    ],
    checkinsByHabitId: {
      h1: [
        "2025-12-27",
        "2025-12-28",
        "2025-12-29",
        "2025-12-30",
        "2025-12-31",
      ],
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("setItem", () => {
    it("stores and retrieves JSON data", () => {
      setItem(key, state);
      expect(getItem(key)).toEqual(state);
    });

    it("overwrites existing value", () => {
      setItem(key, { a: 1 });
      setItem(key, { a: 2 });
      expect(getItem(key)).toEqual({ a: 2 });
    });
  });

  describe("getItem", () => {
    it("returns null when key does not exist", () => {
      expect(getItem("missing-key")).toBeNull();
    });

    it("returns null when stored JSON is corrupted", () => {
      localStorage.setItem(key, "{ this is not valid JSON");
      expect(getItem(key)).toBeNull();
    });
  });

  describe("removeItem", () => {
    it("removes the key", () => {
      setItem(key, state);
      removeItem(key);
      expect(getItem(key)).toBeNull();
    });

    it("does not throw when key is missing", () => {
      expect(() => removeItem("missing-key")).not.toThrow();
    });
  });
});
