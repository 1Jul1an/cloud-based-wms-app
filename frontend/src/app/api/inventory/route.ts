import { NextResponse } from "next/server";
import { getInventoryApiShape } from "../../data/wmsMockData";

export async function GET() {
  return NextResponse.json(getInventoryApiShape(), {
    headers: { "Cache-Control": "no-store, must-revalidate" }
  });
}
