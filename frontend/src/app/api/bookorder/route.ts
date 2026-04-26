import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    Status: { success: true },
    message: "Inbound delivery booked",
    orderId: body.orderId
  });
}
