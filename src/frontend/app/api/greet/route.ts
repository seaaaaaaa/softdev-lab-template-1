const DEFAULT_BACKEND_URL = "http://127.0.0.1:3000";

/**
 * Proxies the greeting request to the Go backend so the browser only ever
 * talks to the Next.js origin and no CORS configuration is needed.
 */
export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name") ?? "";
  const backendUrl = process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL;
  const query = name ? `?name=${encodeURIComponent(name)}` : "";

  try {
    const response = await fetch(`${backendUrl}/greet${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { message: "Backend request failed" },
        { status: 502 },
      );
    }

    return Response.json(await response.json());
  } catch {
    return Response.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
