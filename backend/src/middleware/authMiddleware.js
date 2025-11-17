import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';

async function resolveTokenUser(token) {
  if (!token) {
    return null;
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  return user ?? null;
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const user = await resolveTokenUser(token);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const user = await resolveTokenUser(token);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // swallow invalid tokens for optional auth
  }
  next();
}

export function authorize(roles = []) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed to perform this action' });
    }
    next();
  };
}
