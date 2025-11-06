import { prisma } from '../app.js';
import { serializeProduct } from '../utils/serializers.js';

const parseListParam = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => entry.split(','))
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  }
  return value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
};

export async function listProducts(req, res, next) {
  try {
    const {
      query,
      categoryId,
      priceMin,
      priceMax,
      sort,
      audience,
      colors,
      sizes,
      materials,
      badges,
      style,
      featured,
      newArrival,
      brand
    } = req.query;

    const filters = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    if (audience && audience !== 'all') {
      const normalizedAudience = audience.toUpperCase();
      const allowedAudiences = ['WOMEN', 'MEN', 'KIDS', 'UNISEX'];
      if (allowedAudiences.includes(normalizedAudience)) {
        filters.audience = normalizedAudience;
      }
    }
    if (brand) {
      filters.brand = { contains: brand, mode: 'insensitive' };
    }
    if (query) {
      filters.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }
    const parsedMin = priceMin !== undefined && priceMin !== '' ? Number(priceMin) : undefined;
    const parsedMax = priceMax !== undefined && priceMax !== '' ? Number(priceMax) : undefined;
    if (Number.isFinite(parsedMin) || Number.isFinite(parsedMax)) {
      filters.price = {};
      if (Number.isFinite(parsedMin)) filters.price.gte = parsedMin;
      if (Number.isFinite(parsedMax)) filters.price.lte = parsedMax;
    }

    const colorList = parseListParam(colors);
    if (colorList.length > 0) {
      filters.colorOptions = { hasSome: colorList };
    }

    const sizeList = parseListParam(sizes);
    if (sizeList.length > 0) {
      filters.sizeOptions = { hasSome: sizeList };
    }

    const materialList = parseListParam(materials);
    if (materialList.length > 0) {
      filters.materials = { hasSome: materialList };
    }

    const badgesList = parseListParam(badges);
    if (badgesList.length > 0) {
      filters.badges = { hasSome: badgesList };
    }

    if (style) {
      filters.style = { contains: style, mode: 'insensitive' };
    }

    if (featured === 'true') {
      filters.isFeatured = true;
    }

    if (newArrival === 'true') {
      filters.isNewArrival = true;
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

export async function getCurated(req, res, next) {
  try {
    const [hero, newArrivals, highlightedSets, statementPieces] = await Promise.all([
      prisma.product.findFirst({
        where: { isFeatured: true },
        include: { category: true, inventory: true },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }]
      }),
      prisma.product.findMany({
        where: { isNewArrival: true },
        include: { category: true, inventory: true },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      prisma.product.findMany({
        where: { style: { contains: 'capsule', mode: 'insensitive' } },
        include: { category: true, inventory: true },
        take: 6
      }),
      prisma.product.findMany({
        where: { badges: { hasSome: ['statement', 'runway', 'artisanal'] } },
        include: { category: true, inventory: true },
        take: 6
      })
    ]);

    res.json({
      hero: hero ? serializeProduct(hero) : null,
      newArrivals: newArrivals.map(serializeProduct),
      capsuleEdit: highlightedSets.map(serializeProduct),
      statementPieces: statementPieces.map(serializeProduct)
    });
  } catch (error) {
    next(error);
  }
}
