import { Postgres } from "./Postgres";
import { describe, beforeEach, afterEach, it, expect } from "vitest"; // Changed import

describe("Postgres Connection Provider (Integration)", () => {
  let postgres: Postgres;

  beforeEach(() => {
    postgres = new Postgres();
  });

  afterEach(async () => {
    await postgres.disconnect();
  });

  it("should connect to the real database", async () => {
    await expect(postgres.connect()).resolves.toBeUndefined();
    expect(postgres["client"]).toBeDefined();
  });

  it("should disconnect from the real database", async () => {
    await postgres.connect();
    await expect(postgres.disconnect()).resolves.toBeUndefined();
    expect(postgres["client"]).toBeNull();
  });
});
