import {prisma} from "@/lib/db";
import { comparePasswords } from "@/lib/hash";
import { signJwtToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signJwtToken({ id: user.id, email: user.email, role: user.role });

  return NextResponse.json({ token });
}