import { NextResponse } from "next/server";
import { wmsData } from "../../data/wmsMockData";

export async function GET() {
  return NextResponse.json({
    corrections: wmsData.stockMovements.filter((movement) => movement.type.toLowerCase().includes("adjustment"))
  });
}
