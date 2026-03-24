import { requireApiSession } from "@/lib/auth/api-auth";
import { NextResponse } from "next/server";

/**
 * Example protected API: returns the current user from the session + JWT.
 * Use the same pattern for cart, orders, or premium APIs.
 */
export async function GET() {
  const auth = await requireApiSession();
  if (!auth.ok) return auth.response;

  const { user } = auth.session;
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  });
}
