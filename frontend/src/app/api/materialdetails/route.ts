import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "../../data/wmsMockData";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const product = getProduct(body.productId || body.materialId || "PRD-1001");
  return NextResponse.json({ product });
}
