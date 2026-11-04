import { NextResponse } from "next/server";
import { initialDB } from "../../../config/initialDB";
import { getS25OfflineDatabase } from "../../../config/demoCommerceDB";

export const dynamic = "force-static";

export async function GET() {
  const s25Db = getS25OfflineDatabase(initialDB);
  return NextResponse.json(s25Db, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"
    }
  });
}
