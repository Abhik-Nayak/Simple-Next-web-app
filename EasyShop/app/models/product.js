import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  offerPrice: Number,
  imageUrls: [String], // multiple images
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
