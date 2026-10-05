import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Health Check API", () => {
  it("GET /api/health should return 200 OK with service status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "Touchless Recipe API");
    expect(res.body).toHaveProperty("timestamp");
  });
});
