import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    storeUrl: { type: String, required: true },
    category: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret.slug;
        delete ret._id;
        delete ret.slug;
      },
    },
  },
);

export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
