import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../app.js';
import { serializeOrder } from '../utils/serializers.js';

const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(5).max(30).optional()
  })
  .refine((value) => value.name || value.phone, { message: 'No updates provided' });

const addressSchema = z.object({
  label: z.string().min(1).max(60),
  line1: z.string().min(1).max(180),
  line2: z.string().max(180).optional().nullable(),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(30),
  country: z.string().min(2).max(80),
  isDefaultShipping: z.boolean().optional()
});

const paymentMethodSchema = z.object({
  provider: z.string().min(1),
  brand: z.string().optional(),
  last4: z.string().min(4).max(4),
  expiresMonth: z.coerce.number().int().min(1).max(12),
  expiresYear: z.coerce.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 25),
  providerPaymentMethodId: z.string().min(1),
  isDefault: z.boolean().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

async function ensurePreferenceRecords(userId) {
  const [notificationPreference, profileSetting] = await Promise.all([
    prisma.notificationPreference.upsert({
      where: { userId },
      update: {},
      create: { userId }
    }),
    prisma.profileSetting.upsert({
      where: { userId },
      update: {},
      create: { userId }
    })
  ]);
  return { notificationPreference, profileSetting };
}

export async function getAccountOverview(req, res, next) {
  try {
    const [user, orderCount, defaultAddress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
      prisma.address.findFirst({ where: { userId: req.user.id, isDefaultShipping: true } })
    ]);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        orders: orderCount
      },
      defaultAddress
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAccountProfile(req, res, next) {
  try {
    const payload = profileUpdateSchema.parse(req.body ?? {});
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: payload,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function listAccountOrders(req, res, next) {
  try {
    const limit = Number(req.query.limit ?? 5);
    const status = req.query.status;
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
        ...(status ? { status } : {})
      },
      include: {
        items: { include: { product: { include: { inventory: true, category: true } } } },
        conversations: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 20)
    });

    res.json({
      orders: orders.map((order) => ({
        ...serializeOrder(order),
        conversationId: order.conversations?.[0]?.id ?? null
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function getAccountOrder(req, res, next) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: { include: { product: { include: { inventory: true, category: true } } } }, conversations: { select: { id: true } } }
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      order: {
        ...serializeOrder(order),
        conversationId: order.conversations?.[0]?.id ?? null
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function listAddresses(req, res, next) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefaultShipping: 'desc' }, { createdAt: 'desc' }]
    });
    res.json({ addresses });
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req, res, next) {
  try {
    const payload = addressSchema.parse(req.body ?? {});
    const address = await prisma.$transaction(async (tx) => {
      if (payload.isDefaultShipping) {
        await tx.address.updateMany({
          where: { userId: req.user.id, isDefaultShipping: true },
          data: { isDefaultShipping: false }
        });
      }
      return tx.address.create({
        data: {
          ...payload,
          line2: payload.line2 ?? null,
          userId: req.user.id,
          isDefaultShipping: payload.isDefaultShipping ?? false
        }
      });
    });
    res.status(201).json({ address });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const payload = addressSchema.parse(req.body ?? {});
    const address = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    const updated = await prisma.$transaction(async (tx) => {
      if (payload.isDefaultShipping) {
        await tx.address.updateMany({
          where: { userId: req.user.id, isDefaultShipping: true },
          data: { isDefaultShipping: false }
        });
      }
      return tx.address.update({
        where: { id: address.id },
        data: {
          ...payload,
          line2: payload.line2 ?? null,
          isDefaultShipping: payload.isDefaultShipping ?? address.isDefaultShipping
        }
      });
    });
    res.json({ address: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const address = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    await prisma.address.delete({ where: { id: address.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function listPaymentMethods(req, res, next) {
  try {
    const methods = await prisma.paymentInstrument.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
    res.json({ paymentMethods: methods });
  } catch (error) {
    next(error);
  }
}

export async function createPaymentMethod(req, res, next) {
  try {
    const payload = paymentMethodSchema.parse(req.body ?? {});
    const method = await prisma.$transaction(async (tx) => {
      if (payload.isDefault) {
        await tx.paymentInstrument.updateMany({
          where: { userId: req.user.id, isDefault: true },
          data: { isDefault: false }
        });
      }
      return tx.paymentInstrument.create({
        data: {
          ...payload,
          brand: payload.brand ?? null,
          userId: req.user.id,
          isDefault: payload.isDefault ?? false
        }
      });
    });
    res.status(201).json({ paymentMethod: method });
  } catch (error) {
    next(error);
  }
}

export async function deletePaymentMethod(req, res, next) {
  try {
    const method = await prisma.paymentInstrument.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    await prisma.paymentInstrument.delete({ where: { id: method.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(req, res, next) {
  try {
    const { notificationPreference, profileSetting } = await ensurePreferenceRecords(req.user.id);
    res.json({
      notificationPreference,
      profileSetting
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const body = req.body ?? {};
    await ensurePreferenceRecords(req.user.id);
    const [notificationPreference, profileSetting] = await Promise.all([
      prisma.notificationPreference.update({
        where: { userId: req.user.id },
        data: {
          orderUpdatesEmail: body.orderUpdatesEmail ?? undefined,
          orderUpdatesPush: body.orderUpdatesPush ?? undefined,
          promotionsEmail: body.promotionsEmail ?? undefined,
          promotionsPush: body.promotionsPush ?? undefined
        }
      }),
      prisma.profileSetting.update({
        where: { userId: req.user.id },
        data: {
          language: body.language ?? undefined,
          currency: body.currency ?? undefined,
          region: body.region ?? undefined
        }
      })
    ]);
    res.json({ notificationPreference, profileSetting });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const payload = changePasswordSchema.parse(req.body ?? {});
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(payload.currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hashed = await bcrypt.hash(payload.newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
