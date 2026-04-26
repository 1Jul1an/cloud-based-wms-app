import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    Status: { success: true },
    message: "Inbound delivery moved to quality review",
    orderId: body.orderId,
    comment: body.comment
  });
}
