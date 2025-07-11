import connectDB from "@/app/config/db";
import User from "@/app/models/user";

export async function DELETE(req) {
  await connectDB();

  const body = await req.json();
  const { email } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  const result = await User.findOneAndDelete({ email });

  if (!result) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  return Response.json({ message: `User with email ${email} deleted` });
}
