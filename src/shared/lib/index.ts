/**
 * Tiny shared helpers (dates, assertions, formatting).
 */

export function assertNever(): never {
  throw new Error("Unexpected value");
}
