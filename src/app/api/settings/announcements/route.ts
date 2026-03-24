import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: "site_announcements" },
    });

    if (!setting) {
      // Fallback to defaults
      return NextResponse.json([
        { text: "Make It Happen — No Excuses", href: "/shop" },
        { text: "Build Your Legacy", href: "/tools" },
        { text: "Standard Shipping — Free", href: "/shop" },
        { text: "Elite Performance — No Shortcuts", href: "/tools" }
      ]);
    }

    return NextResponse.json(setting.value);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
