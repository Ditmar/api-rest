import { Postgres } from "./Postgres";
import { Sequelize } from "@sequelize/core";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("@sequelize/core", () => {
  const mSequelize = {
    authenticate: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  };
  return {
    Sequelize: vi.fn(() => mSequelize),
    Model: vi.fn(),
  };
});

vi.mock("@sequelize/postgres", () => ({
  PostgresDialect: vi.fn(),
}));

describe("Postgres Connection Provider", () => {
  let postgres: Postgres;

  beforeEach(() => {
    postgres = new Postgres();
    vi.clearAllMocks();
  });

  it("should connect and set the client", async () => {
    await expect(postgres.connect()).resolves.toBeUndefined();
    expect(postgres["client"]).toBeDefined();
    expect(Sequelize).toHaveBeenCalled();
  });

  it("should disconnect and unset the client", async () => {
    await postgres.connect();
    const client = postgres["client"];
    await expect(postgres.disconnect()).resolves.toBeUndefined();
    expect(client?.close).toHaveBeenCalled();
    expect(postgres["client"]).toBeNull();
  });

  it("should not throw if disconnect is called when not connected", async () => {
    await expect(postgres.disconnect()).resolves.toBeUndefined();
  });
});
