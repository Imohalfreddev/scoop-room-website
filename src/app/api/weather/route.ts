import { NextResponse } from "next/server";
import { weatherMock } from "@/lib/mock/widgets";

// Swap the body of this handler for a real provider (OpenWeather, etc.)
// once an API key is available — the WeatherData shape stays the same.
export async function GET() {
  return NextResponse.json(weatherMock);
}
