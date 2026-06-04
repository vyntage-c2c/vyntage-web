import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const url = process.env.APPS_SCRIPT_URL;
    if (!url) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const res = await fetch(`${url}?email=${encodeURIComponent(email.trim())}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to save" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
