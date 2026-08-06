/**
 * @jest-environment node
 */
import { GET } from "./route";

describe("GET /api/greet", () => {
  const originalBackendUrl = process.env.BACKEND_URL;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.BACKEND_URL = originalBackendUrl;
    jest.restoreAllMocks();
  });

  it("forwards the name to the backend and returns the message", async () => {
    process.env.BACKEND_URL = "http://backend:3000";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Hello, Ann!" }),
    });

    const response = await GET(
      new Request("http://localhost:3001/api/greet?name=Ann"),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://backend:3000/greet?name=Ann",
      { cache: "no-store" },
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "Hello, Ann!" });
  });

  it("calls the default backend without a query when no name is given", async () => {
    delete process.env.BACKEND_URL;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Hello, friend!" }),
    });

    const response = await GET(new Request("http://localhost:3001/api/greet"));

    expect(global.fetch).toHaveBeenCalledWith("http://127.0.0.1:3000/greet", {
      cache: "no-store",
    });
    await expect(response.json()).resolves.toEqual({
      message: "Hello, friend!",
    });
  });

  it("returns 502 when the backend responds with an error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const response = await GET(new Request("http://localhost:3001/api/greet"));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      message: "Backend request failed",
    });
  });

  it("returns 502 when the backend is unreachable", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("ECONNREFUSED"),
    );

    const response = await GET(new Request("http://localhost:3001/api/greet"));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      message: "Backend unreachable",
    });
  });
});
