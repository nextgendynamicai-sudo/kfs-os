import { NextResponse } from "next/server";
import { initialDB } from "../../../config/initialDB";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(initialDB, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"
    }
  });
}
