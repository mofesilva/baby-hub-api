import { Schema, model, models } from 'mongoose';

const AttachmentSchema = new Schema(
  {
    label: { type: String },
    url: { type: String, required: true },
  },
  { _id: false },
);

const BabyTimelineEntrySchema = new Schema(
  {
    babyId: { type: Schema.Types.ObjectId, ref: 'Baby', required: true },
    type: {
      type: String,
      enum: ['milestone', 'appointment', 'exam', 'note'],
      default: 'milestone',
    },
    title: { type: String, required: true },
    description: { type: String },
    occurredAt: { type: Date, required: true },
    attachments: { type: [AttachmentSchema], default: [] },
    isPublic: { type: Boolean, default: true },
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

export const BabyTimelineEntryModel =
  models.BabyTimelineEntry || model('BabyTimelineEntry', BabyTimelineEntrySchema);
