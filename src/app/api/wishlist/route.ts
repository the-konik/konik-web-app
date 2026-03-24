import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
      tool: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(wishlist);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, toolId } = await req.json();

  if (!productId && !toolId) {
    return NextResponse.json({ error: "Missing productId or toolId" }, { status: 400 });
  }

  try {
    const entry = await db.wishlist.upsert({
      where: {
        userId_productId_toolId: {
          userId: session.user.id,
          productId: productId || null,
          toolId: toolId || null,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        productId: productId || null,
        toolId: toolId || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, toolId } = await req.json();

  try {
    await db.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId || null,
        toolId: toolId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
