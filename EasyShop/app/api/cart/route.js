import { getServerSession } from "next-auth";
import { GET } from "../auth/[...nextauth]/route";
// import connectDB from "@/app/config/db";
// import User from "@/app/models/user";

export async function POST(req) {
  try {
    const session = await getServerSession(GET);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    // Destructure the expected fields from the request body
    const { productId, quantity, productData } = body;

    // Optional: Validate the incoming data
    if (!productId || typeof quantity !== "number" || !productData) {
      return new Response("Invalid request body", { status: 400 });
    }
    console.log(body);
    return Response.json({ success: true, cartItems: body });
  } catch (err) {
    console.log(err);
  }
}
