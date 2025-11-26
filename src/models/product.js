import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    storeUrl: { type: String, required: true },
    category: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret.slug;
        delete ret._id;
        delete ret.slug;
        delete ret.isDeleted;
      },
    },
  },
);

export const ProductModel = models.Product || model('Product', ProductSchema);
