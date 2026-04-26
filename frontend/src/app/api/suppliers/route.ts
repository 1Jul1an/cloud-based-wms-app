import { NextResponse } from "next/server";
import { getSupplierApiShape } from "../../data/wmsMockData";

export async function GET() {
  return NextResponse.json(getSupplierApiShape(), {
    headers: { "Cache-Control": "no-store, must-revalidate" }
  });
}
