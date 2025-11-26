import { readFileSync } from 'node:fs';
import { ProductModel } from '../models/product.js';

const productsSeed = JSON.parse(
	readFileSync(new URL('../data/products.json', import.meta.url), 'utf-8'),
);

const mapProduct = (product) => {
	if (!product) return null;
	const { slug, _id, ...rest } = product;
	return { ...rest, id: slug };
};

export const listProducts = async () => {
	const docs = await ProductModel.find({ isActive: true }).sort({ title: 1 }).lean();
	return docs.map(mapProduct);
};

export const getProductBySlug = async (slug) => {
	const doc = await ProductModel.findOne({ slug }).lean();
	return mapProduct(doc);
};

export const seedProductsIfNeeded = async () => {
	const count = await ProductModel.estimatedDocumentCount();
	if (count > 0) return;

	const payload = productsSeed.map((product) => ({
		slug: product.id,
		title: product.title,
		description: product.description,
		price: product.price,
		imageUrl: product.imageUrl,
		storeUrl: product.storeUrl,
		category: product.category,
	}));

	await ProductModel.insertMany(payload);
	console.log(`Seeded ${payload.length} produtos no MongoDB`);
};
