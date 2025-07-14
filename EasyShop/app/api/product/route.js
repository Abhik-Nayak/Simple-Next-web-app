import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/config/db";
import Product from "@/app/models/product";
import User from "@/app/models/user";
import cloudinary from "@/app/config/cloudinary";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");
    const images = formData.getAll("images"); // multiple images
    const sellerId = formData.get("sellerId");

    await connectDB();

    const uploadedImages = [];

    for (const img of images) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const base64 = buffer.toString("base64");

      const uploadRes = await cloudinary.uploader.upload(
        `data:${img.type};base64,${base64}`,
        { folder: "easyshop/products" }
      );
      uploadedImages.push(uploadRes.secure_url);
    }
    console.log("sessionUserId", session, session.user._id);
    const newProduct = await Product.create({
      name,
      description,
      price,
      offerPrice,
      category,
      quantity,
      imageUrls: uploadedImages,
      sellerId: sellerId,
    });

    return Response.json({ success: true, product: newProduct });
  } catch (err) {
    console.error("UPLOAD ERROR", err);
    return new Response("Upload failed", { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    await connectDB();

    // Get seller's MongoDB ID using their email from session
    const seller = await User.findOne({ email: session.user.email });
    if (!seller) return new Response("Seller not found", { status: 404 });
    console.log("seller", seller);

    const products = await Product.find({ sellerId: seller._id });

    return Response.json({ success: true, products });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return new Response("Server error", { status: 500 });
  }
}
