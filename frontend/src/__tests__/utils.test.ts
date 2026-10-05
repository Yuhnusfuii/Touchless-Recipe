import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("Utils - cn() Class Merge Utility", () => {
  it("should merge class names cleanly", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });

  it("should resolve conflicting tailwind classes", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle conditional class names", () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn("base-class", isTrue && "active-class", isFalse && "inactive-class");
    expect(result).toBe("base-class active-class");
  });
});
