// app/api/users/route.js


import connectDB from "@/app/config/db";
import User from "@/app/models/user";

export async function GET() {
  await connectDB();

  const users = await User.find();
  return Response.json(users);
}
