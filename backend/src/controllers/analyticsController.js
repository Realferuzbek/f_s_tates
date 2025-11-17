import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../app.js';

const trackSchema = z.object({
  eventType: z.string().min(1),
  screen: z.string().optional(),
  properties: z.record(z.any()).optional()
});

const SESSION_COOKIE = '__fst_session';

export async function trackEvent(req, res, next) {
  try {
    const payload = trackSchema.parse(req.body ?? {});
    let sessionId = req.cookies?.[SESSION_COOKIE];
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30
      });
    }

    await prisma.event.create({
      data: {
        sessionId,
        userId: req.user?.id ?? null,
        eventType: payload.eventType,
        screen: payload.screen ?? null,
        properties: payload.properties ?? {}
      }
    });

    res.status(202).json({ ok: true });
  } catch (error) {
    next(error);
  }
}
