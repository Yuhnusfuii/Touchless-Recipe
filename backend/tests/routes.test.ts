import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API Routes & Error Handlers", () => {
  it("GET /api/v1/unknown-route should return 404 Not Found", async () => {
    const res = await request(app).get("/api/v1/non-existent-endpoint-123");
    expect(res.status).toBe(404);
  });
});
