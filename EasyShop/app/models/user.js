// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: false },
    cartItems: { type: Object, default: () => ({}) },
    password: { type: String }, // For manual auth
    role: { type: String, default: "buyer" },
  },
  { timestamps: true, minimize: false }
);

/**
 * Exports the User model. If the model already exists in mongoose.models (due to hot-reloading in development),
 * it reuses the existing model to prevent OverwriteModelError. Otherwise, it creates a new model using the userSchema.
 * This pattern is commonly used in Next.js and similar environments where files may be re-imported multiple times.
 */
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
