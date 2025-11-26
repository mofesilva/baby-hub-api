import { Schema, model, models } from 'mongoose';

const PledgeItemSchema = new Schema(
  {
    productSlug: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    snapshot: {
      title: String,
      price: Number,
    },
  },
  { _id: false },
);

const PledgeSchema = new Schema(
  {
    donor: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      message: { type: String },
    },
    items: { type: [PledgeItemSchema], required: true },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.isDeleted;
      },
    },
  },
);

export const PledgeModel = models.Pledge || model('Pledge', PledgeSchema);
