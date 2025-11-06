import { prisma } from '../app.js';
import { serializeProduct } from '../utils/serializers.js';

export async function listProducts(req, res, next) {
  try {
    const { query, categoryId, priceMin, priceMax, sort } = req.query;
    const filters = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    if (query) {
      filters.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = parseFloat(priceMin);
      if (priceMax) filters.price.lte = parseFloat(priceMax);
    }

    const orderBy = (() => {
      switch (sort) {
        case 'price_asc':
          return { price: 'asc' };
        case 'price_desc':
          return { price: 'desc' };
        case 'newest':
          return { createdAt: 'desc' };
        default:
          return { updatedAt: 'desc' };
      }
    })();

    const products = await prisma.product.findMany({
      where: filters,
      include: { category: true, inventory: true },
      orderBy
    });

    res.json({ products: products.map(serializeProduct) });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.productId },
      include: { category: true, inventory: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
}

export async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
}
