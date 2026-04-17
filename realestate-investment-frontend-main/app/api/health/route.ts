import { NextResponse } from "next/server";

const backendApiBase =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://realestate-investment-backend.vercel.app/api";

const backendOrigin = backendApiBase.replace(/\/api\/?$/, "");

export async function GET() {
  try {
    const response = await fetch(`${backendOrigin}/health`, {
      cache: "no-store"
    });

    const payload = await response.json().catch(() => ({
      success: false,
      status: "invalid-response"
    }));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: "degraded",
          upstreamStatus: response.status,
          upstream: payload
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: "down",
        message: "Unable to reach backend health endpoint"
      },
      { status: 503 }
    );
  }
}
