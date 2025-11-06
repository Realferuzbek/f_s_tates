import { prisma } from '../app.js';
import { serializeProduct } from '../utils/serializers.js';

export async function getCart(req, res, next) {
  try {
    const cart = await prisma.cart.upsert({
      where: { userId: req.user.id },
      update: {},
      create: { userId: req.user.id }
    });

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: { include: { inventory: true, category: true } } }
    });

    res.json({
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: serializeProduct(item.product),
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCart(req, res, next) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await prisma.cart.upsert({
      where: { userId: req.user.id },
      update: {},
      create: { userId: req.user.id }
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    const createOperations = items
      .filter((item) => item.quantity > 0 && item.productId)
      .map((item) =>
        prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            selectedSize: item.selectedSize ?? null,
            selectedColor: item.selectedColor ?? null
          }
        })
      );

    if (createOperations.length > 0) {
      await prisma.$transaction(createOperations);
    }

    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: { include: { inventory: true, category: true } } }
    });

    res.json({
      items: updatedItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: serializeProduct(item.product),
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))
    });
  } catch (error) {
    next(error);
  }
}
