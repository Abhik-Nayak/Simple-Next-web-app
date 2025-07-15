import { prisma } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = verifyJwtToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId: user.id,
      productId,
      quantity,
    },
  });

  return NextResponse.json({ item });
}
