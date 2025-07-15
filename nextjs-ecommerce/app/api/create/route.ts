import { prisma } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyJwtToken(token);
  if (!user || user.role !== "SELLER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, price, image, category, stock } = await req.json();

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      image,
      category,
      stock: parseInt(stock),
      sellerId: user.id,
    },
  });

  return NextResponse.json({ product });
}
