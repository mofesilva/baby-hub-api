import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    pledgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pledge', required: true },
    pixProof: { type: String },
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

export const DonationModel = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
