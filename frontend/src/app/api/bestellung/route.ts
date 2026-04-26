import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    message: "Replenishment request accepted",
    data: {
      id: `PO-${Date.now()}`,
      status: "expected",
      request: body
    }
  });
}
