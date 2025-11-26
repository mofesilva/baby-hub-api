import mongoose from 'mongoose';

const PledgeItemSchema = new mongoose.Schema(
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

const PledgeSchema = new mongoose.Schema(
  {
    donor: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      message: { type: String },
    },
    items: { type: [PledgeItemSchema], required: true },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

export const PledgeModel = mongoose.models.Pledge || mongoose.model('Pledge', PledgeSchema);
