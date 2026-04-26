import { NextResponse } from "next/server";
import { getIncomeApiShape } from "../../data/wmsMockData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getIncomeApiShape(), {
    headers: { "Cache-Control": "no-store, must-revalidate" }
  });
}
