import { DonationModel } from '../models/donation.js';

export const recordDonation = async ({ donor, pledgeId, pixProof }) => {
  const donation = await DonationModel.create({ donor, pledgeId, pixProof });
  return donation.toJSON();
};

export const listDonations = async () => DonationModel.find().sort({ createdAt: -1 }).lean();
