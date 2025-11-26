import { BabyModel } from '../models/baby.js';
import { BabyTimelineEntryModel } from '../models/baby-timeline-entry.js';

const mapDoc = (doc) => (typeof doc?.toJSON === 'function' ? doc.toJSON() : doc);

export const listPublicBabies = async () => {
  const docs = await BabyModel.find({ isActive: true, isDeleted: false }).sort({ createdAt: 1 });
  return docs.map(mapDoc);
};

export const findActiveBabyBySlug = async (slug) =>
  BabyModel.findOne({ slug, isDeleted: false, isActive: true });

export const listPublicTimelineEntries = async (babyId) => {
  const docs = await BabyTimelineEntryModel.find({
    babyId,
    isDeleted: false,
    isPublic: true,
  })
    .sort({ occurredAt: -1, createdAt: -1 })
    .lean();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    description: doc.description,
    occurredAt: doc.occurredAt,
    attachments: doc.attachments,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
};

export const getBabyProfileBySlug = async (slug) => {
  const baby = await findActiveBabyBySlug(slug);
  if (!baby) return null;

  const timeline = await listPublicTimelineEntries(baby._id);
  return { ...mapDoc(baby), timeline };
};
