import { prisma } from '../app.js';
import { appendMessage, ensureSupportConversation, markConversationAsReadForUser } from '../utils/chatService.js';
import { z } from 'zod';

const sendMessageSchema = z.object({
  text: z.string().trim().min(1).max(4000)
});

const messagePageSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(40),
  cursor: z.string().optional()
});

function mapThread(conversation) {
  return {
    id: conversation.id,
    title: conversation.title,
    orderId: conversation.orderId,
    orderStatus: conversation.order?.status ?? null,
    lastMessagePreview: conversation.lastMessagePreview ?? null,
    lastMessageAt: conversation.lastMessageAt,
    unreadForUser: conversation.unreadForUser,
    isSupport: conversation.isSupport
  };
}

export async function listThreads(req, res, next) {
  try {
    await ensureSupportConversation(req.user.id);
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      include: {
        order: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: [
        { lastMessageAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      threads: conversations.map(mapThread)
    });
  } catch (error) {
    next(error);
  }
}

export async function getThread(req, res, next) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        order: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const { limit, cursor } = messagePageSchema.parse(req.query);
    const take = limit + 1;
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    });

    let nextCursor = null;
    if (messages.length > limit) {
      const nextMessage = messages.pop();
      nextCursor = nextMessage?.id ?? null;
    }

    res.json({
      conversation: {
        ...mapThread(conversation),
        order: conversation.order
          ? {
              id: conversation.order.id,
              status: conversation.order.status,
              total: Number(conversation.order.total),
              items: conversation.order.items.map((item) => ({
                id: item.id,
                name: item.product?.name ?? '',
                image: item.product?.image ?? null
              }))
            }
          : null,
        messages: messages.reverse().map((message) => ({
          id: message.id,
          senderType: message.senderType,
          kind: message.kind,
          text: message.text,
          payload: message.payload,
          createdAt: message.createdAt,
          readByUser: message.readByUser,
          readByAdmin: message.readByAdmin
        })),
        nextCursor
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createUserMessage(req, res, next) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    const payload = sendMessageSchema.parse(req.body ?? {});
    const message = await appendMessage(conversation.id, {
      senderType: 'USER',
      text: payload.text,
      kind: 'TEXT',
      senderId: req.user.id,
      readByUser: new Date()
    });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
}

export async function markThreadRead(req, res, next) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    await markConversationAsReadForUser(conversation.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
