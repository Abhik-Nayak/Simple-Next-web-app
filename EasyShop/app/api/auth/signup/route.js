import connectDB from "@/app/config/db";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'seller'
    });

    return new Response("User registered", { status: 201 });
  } catch (err) {
    return new Response("Signup error: " + err.message, { status: 500 });
  }
}
