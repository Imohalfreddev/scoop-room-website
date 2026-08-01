import { NextResponse } from "next/server";
import { marketsMock } from "@/lib/mock/widgets";

export async function GET() {
  return NextResponse.json({ items: marketsMock });
}
