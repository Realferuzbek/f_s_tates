import { prisma } from '../app.js';
import { serializeProduct } from '../utils/serializers.js';

export async function getDashboard(req, res, next) {
  try {
    const [totalRevenue, ordersCount, customersCount, lowInventoryCount, products] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.inventory.count({ where: { quantity: { lt: 5 } } }),
      prisma.product.findMany({
        include: { category: true, inventory: true },
        orderBy: { updatedAt: 'desc' },
        take: 10
      })
    ]);

    res.json({
      metrics: {
        totalRevenue: Number(totalRevenue._sum.total ?? 0).toFixed(2),
        orders: ordersCount,
        customers: customersCount,
        lowInventory: lowInventoryCount
      },
      products: products.map(serializeProduct)
    });
  } catch (error) {
    next(error);
  }
}
