import { NextRequest, NextResponse } from "next/server";
import { getSupplierMaterialsApiShape } from "../../data/wmsMockData";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const legacyId = body?.LiefID || body?.Lieferant?.LiefID || 1;
  return NextResponse.json({
    message: "Supplier materials loaded",
    data: getSupplierMaterialsApiShape(Number(legacyId))
  });
}
