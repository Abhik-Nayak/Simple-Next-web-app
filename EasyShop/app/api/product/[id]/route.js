// app/api/products/[id]/route.js
import mongoose from "mongoose";
import connectDB from "@/app/config/db";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function GET(req, contextPromise) {
  const context = await contextPromise; // ✅ await the context
  const { id } = context.params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
