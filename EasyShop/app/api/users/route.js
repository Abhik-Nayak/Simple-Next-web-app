// app/api/users/route.js


import connectDB from "@/app/config/db";
import User from "@/app/models/user";

export async function GET() {
  await connectDB();

  const users = await User.find();
  return Response.json(users);
}

// Delete all users
export async function DELETE() {
  await connectDB();
  await User.deleteMany({});
  return Response.json({ message: "All users deleted" });
}