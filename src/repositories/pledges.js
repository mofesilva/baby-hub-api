import { PledgeModel } from '../models/pledge.js';
import { ProductModel } from '../models/product.js';

const normalizeItemResponse = (item) => ({
  productId: item.productSlug,
  quantity: item.quantity,
  snapshot: item.snapshot,
});

const normalizePledgeResponse = (raw) => {
  if (!raw) return null;
  const plain = typeof raw.toJSON === 'function' ? raw.toJSON() : raw;
  const { _id, id, items = [], ...rest } = plain;
  return {
    ...rest,
    id: id || _id?.toString(),
    items: items.map(normalizeItemResponse),
  };
};

export const createPledge = async ({ donor, items }) => {
  const slugs = items.map((item) => item.productId);
  const products = await ProductModel.find({ slug: { $in: slugs } }).lean();

  const normalizedItems = items.map((item) => {
    const product = products.find((prod) => prod.slug === item.productId);
    if (!product) {
      throw new Error(`Produto ${item.productId} não encontrado`);
    }

    return {
      productSlug: product.slug,
      quantity: item.quantity ?? 1,
      snapshot: {
        title: product.title,
        price: product.price,
      },
    };
  });

  const pledge = await PledgeModel.create({ donor, items: normalizedItems });
  return normalizePledgeResponse(pledge);
};

export const listPledges = async () => {
  const docs = await PledgeModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(normalizePledgeResponse);
};

export const findPledgeById = async (id) => normalizePledgeResponse(await PledgeModel.findById(id).lean());
