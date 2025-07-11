import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/config/db";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const {
      _id: productId,
      name,
      offerPrice,
      price,
      image,
      description,
      category,
    } = await req.json();

    if (!productId || !name || !description) {
      return new Response("Missing fields in request", { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found", { status: 404 });

    // Check if item exists in cart
    const existingItem = user.cartItems[productId];

    if (existingItem.quantity === 5) {
      return new Response("You can add a maximum of 5 units for any product.", {
        status: 400,
      });
    }

    const updatedQuantity = existingItem?.quantity
      ? existingItem?.quantity + 1
      : 1;

    user.cartItems[productId] = {
      productId,
      productName: name,
      productPrice: offerPrice,
      productImage: image?.[0] || "",
      productDescription: description,
      productCategory: category,
      quantity: updatedQuantity,
    };

    // ✅ Mark cartItems as modified!
    // Mongoose doesn’t track changes inside plain objects (type: Object). When you do:user.cartItems['someId'] = {...}
    // …it doesn't know the object was updated — unless you explicitly say:
    user.markModified("cartItems");

    await user.save();

    return Response.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    console.error("Cart Update Error:", error);
    return new Response("Server error", { status: 500 });
  }
}

// This api function is used for getting all cartitem related to user.
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) return new Response("User not found", { status: 404 });

    return Response.json({
      success: true,
      cartItems: user.cartItems || {},
    });
  } catch (err) {
    console.error("🛒 Cart Fetch Error:", err);
    return new Response("Server error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number") {
      return new Response("Missing or invalid data", { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found", { status: 404 });

    if (!user.cartItems[productId]) {
      return new Response("Item not in cart", { status: 404 });
    }

    user.cartItems[productId].quantity = quantity;
    user.markModified("cartItems");

    await user.save();

    return Response.json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    console.error("PATCH error:", err);
    return new Response("Server error", { status: 500 });
  }
}

// This api ise used for -Remove Item for Cart<User Based>
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { productId } = await req.json();
    if (!productId) return new Response("Missing ProductId", { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found", { status: 404 });

    delete user.cartItems[productId];
    user.markModified("cartItems");
    await user.save();

    return Response.json({ success: true, message: "Item removed" });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response("Server error", { status: 500 });
  }
}
