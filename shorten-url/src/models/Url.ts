// src/models/Url.ts
import  { Schema, model, models } from 'mongoose'

const UrlSchema = new Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: false, // Optional
    },
  },
  { timestamps: true }
)

const Url = models.Url || model('Url', UrlSchema)
export default Url
