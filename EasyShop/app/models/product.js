// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  offerPrice: Number,
  quantity: Number,
  imageUrls: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Important!
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
