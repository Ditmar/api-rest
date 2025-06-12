import { Postgres } from "./Postgres";
import { Sequelize } from "@sequelize/core";

jest.mock("@sequelize/core", () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
  };
  return {
    Sequelize: jest.fn(() => mSequelize),
    Model: jest.fn(),
  };
});

jest.mock("@sequelize/postgres", () => ({
  PostgresDialect: jest.fn(),
}));

describe("Postgres Connection Provider", () => {
  let postgres: Postgres;

  beforeEach(() => {
    postgres = new Postgres();
    jest.clearAllMocks();
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
