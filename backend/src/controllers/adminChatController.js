import { prisma } from '../app.js';
import { appendMessage, markConversationAsReadForAdmin } from '../utils/chatService.js';
import { z } from 'zod';

const adminMessageSchema = z.object({
  text: z.string().trim().min(1).max(4000),
  kind: z.enum(['TEXT', 'ORDER_STATUS', 'CODE', 'NOTE']).optional()
});

export async function listAdminThreads(req, res, next) {
  try {
    const { status, unread } = req.query;
    const where = {};
    if (status) {
      where.order = { status };
    }
    if (unread === 'admin') {
      where.unreadForAdmin = { gt: 0 };
    }
    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, status: true } }
      },
      orderBy: [{ unreadForAdmin: 'desc' }, { lastMessageAt: 'desc' }]
    });
    res.json({
      threads: conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        orderId: conversation.orderId,
        orderStatus: conversation.order?.status ?? null,
        unreadForAdmin: conversation.unreadForAdmin,
        lastMessagePreview: conversation.lastMessagePreview,
        lastMessageAt: conversation.lastMessageAt,
        user: conversation.user
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function adminSendMessage(req, res, next) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    const payload = adminMessageSchema.parse(req.body ?? {});
    const message = await appendMessage(conversation.id, {
      senderType: 'ADMIN',
      kind: payload.kind ?? 'TEXT',
      text: payload.text,
      senderId: req.user.id,
      readByAdmin: new Date()
    });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
}

export async function markThreadReadByAdmin(req, res, next) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id }
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    await markConversationAsReadForAdmin(conversation.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
