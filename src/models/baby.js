import { Schema, model, models } from 'mongoose';

const BabyParentSchema = new Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
  },
  { _id: false },
);

const BabySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    nickname: { type: String },
    gender: { type: String, enum: ['boy', 'girl', 'unknown'], default: 'unknown' },
    dueDate: { type: Date },
    birthDate: { type: Date },
    currentWeek: { type: Number },
    coverImageUrl: { type: String },
    description: { type: String },
    parents: { type: [BabyParentSchema], default: [] },
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

export const BabyModel = models.Baby || model('Baby', BabySchema);
