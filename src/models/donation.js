import { Schema, model, models } from 'mongoose';

const DonationSchema = new Schema(
  {
    donor: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    pledgeId: { type: Schema.Types.ObjectId, ref: 'Pledge', required: true },
    pixProof: { type: String },
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

export const DonationModel = models.Donation || model('Donation', DonationSchema);
