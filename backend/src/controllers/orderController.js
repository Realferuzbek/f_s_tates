import { prisma } from '../app.js';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { serializeOrder } from '../utils/serializers.js';
import { bootstrapOrderConversation, ensureSupportConversation } from '../utils/chatService.js';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1)
  }),
  payment: z.object({
    method: z.enum(['card', 'paypal'])
  })
});

export async function checkout(req, res, next) {
  try {
    const payload = checkoutSchema.parse(req.body);
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const paymentMethod = payload.payment.method.toUpperCase();

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total: new Prisma.Decimal(total.toFixed(2)),
        status: 'PLACED',
        paymentMethod,
        shippingAddress: payload.shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            selectedSize: item.selectedSize ?? null,
            selectedColor: item.selectedColor ?? null
          }))
        }
      },
      include: { items: { include: { product: { include: { inventory: true, category: true } } } } }
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await ensureSupportConversation(req.user.id);
    await bootstrapOrderConversation(order);

    res.status(201).json({ order: serializeOrder(order) });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: { include: { inventory: true, category: true } } } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    next(error);
  }
}
