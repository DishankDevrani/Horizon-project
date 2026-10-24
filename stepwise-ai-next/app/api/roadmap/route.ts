import { NextResponse } from "next/server";

// Stepwise demo mode is fully client-side and uses curated local roadmap data.
// This endpoint intentionally does not call an external AI provider.
export async function POST() {
  return NextResponse.json(
    { error: "Roadmap generation now runs locally in the demo. Use the roadmap builder on the home page." },
    { status: 410 }
  );
}
