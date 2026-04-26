import { NextRequest, NextResponse } from "next/server";
import { getFulfillmentProfileRows } from "../../data/wmsMockData";

export async function GET() {
  return NextResponse.json({ profiles: getFulfillmentProfileRows() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    Updated: { message: "Fulfillment profile saved" },
    data: body
  });
}
