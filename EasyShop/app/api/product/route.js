import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/config/db";
import Product from "@/models/product";
// import cloudinary from "@/config/cloudinary";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");
    const images = formData.getAll("images"); // multiple images

    await connectDB();

    const uploadedImages = [];

    // for (const img of images) {
    //   const buffer = Buffer.from(await img.arrayBuffer());
    //   const base64 = buffer.toString("base64");

    //   const uploadRes = await cloudinary.uploader.upload(
    //     `data:${img.type};base64,${base64}`,
    //     { folder: "easyshop/products" }
    //   );
    //   uploadedImages.push(uploadRes.secure_url);
    // }

    const newProduct = await Product.create({
      name,
      description,
      price,
      offerPrice,
      category,
      imageUrls: ['uploadedImages'],
      sellerId: session.user._id,
    });

    return Response.json({ success: true, product: newProduct });
  } catch (err) {
    console.error("UPLOAD ERROR", err);
    return new Response("Upload failed", { status: 500 });
  }
}
