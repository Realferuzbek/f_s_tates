import { prisma } from '../app.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        defaultShipping: true
      }
    });

    res.json({ profile });
  } catch (error) {
    next(error);
  }
}
