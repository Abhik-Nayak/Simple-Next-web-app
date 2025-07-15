import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing)
    return NextResponse.json({ error: "User already exists" }, { status: 409 });

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "BUYER",
    },
  });
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
