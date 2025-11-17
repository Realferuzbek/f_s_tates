import { prisma } from '../app.js';

function formatOrderReference(orderId) {
  if (!orderId) {
    return '#----';
  }
  return `#${orderId.slice(-4).toUpperCase()}`;
}

function buildConversationTitle(order) {
  if (!order) {
    return 'Order updates';
  }
  const reference = formatOrderReference(order.id);
  const primaryItem = order.items?.[0];
  if (primaryItem?.product?.name) {
    return `Order ${reference} · ${primaryItem.product.name}`;
  }
  return `Order ${reference}`;
}

function buildPreviewFromMessage(message) {
  if (message.kind === 'CODE' && message.payload?.code) {
    return `Code ${message.payload.code}`;
  }
  if (message.kind === 'ORDER_STATUS') {
    return message.text ?? 'Order update';
  }
  if (message.text) {
    return message.text.length > 160 ? `${message.text.slice(0, 157)}…` : message.text;
  }
  return 'New message';
}

export async function appendMessage(
  conversationId,
  { senderType, kind = 'TEXT', text = null, payload = null, senderId = null, readByUser = null, readByAdmin = null }
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderType,
      kind,
      text,
      payload,
      senderId,
      readByUser,
      readByAdmin
    }
  });

  const preview = buildPreviewFromMessage(message);
  const data = {
    lastMessagePreview: preview,
    lastMessageAt: message.createdAt
  };
  if (senderType === 'USER') {
    data.unreadForAdmin = { increment: 1 };
  } else {
    data.unreadForUser = { increment: 1 };
  }
  await prisma.conversation.update({
    where: { id: conversationId },
    data
  });

  return message;
}

export async function ensureOrderConversation(order) {
  if (!order) {
    return null;
  }
  let conversation = await prisma.conversation.findFirst({
    where: { orderId: order.id, userId: order.userId }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        title: buildConversationTitle(order),
        lastMessageAt: new Date()
      }
    });
  }

  return conversation;
}

export async function ensureSupportConversation(userId) {
  if (!userId) {
    return null;
  }
  let conversation = await prisma.conversation.findFirst({
    where: { userId, isSupport: true }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        isSupport: true,
        title: 'Concierge support',
        lastMessageAt: new Date()
      }
    });

    await appendMessage(conversation.id, {
      senderType: 'ADMIN',
      kind: 'NOTE',
      text: 'The concierge team is online 24/7 for post-purchase support.',
      readByAdmin: new Date()
    });
  }

  return conversation;
}

export async function bootstrapOrderConversation(order) {
  const conversation = await ensureOrderConversation(order);
  if (!conversation) {
    return null;
  }
  await appendMessage(conversation.id, {
    senderType: 'SYSTEM',
    kind: 'ORDER_STATUS',
    text: "We've received your order.",
    payload: { event: 'ORDER_PLACED', orderId: order.id, status: order.status },
    readByAdmin: new Date()
  });
  await appendMessage(conversation.id, {
    senderType: 'SYSTEM',
    kind: 'ORDER_STATUS',
    text: 'Payment confirmed.',
    payload: { event: 'PAYMENT_CONFIRMED', orderId: order.id, status: order.status },
    readByAdmin: new Date()
  });
  return conversation;
}

export async function markConversationAsReadForUser(conversationId) {
  if (!conversationId) {
    return null;
  }
  const readAt = new Date();
  await prisma.$transaction([
    prisma.message.updateMany({
      where: { conversationId, readByUser: null },
      data: { readByUser: readAt }
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadForUser: 0 }
    })
  ]);
}

export async function markConversationAsReadForAdmin(conversationId) {
  if (!conversationId) {
    return null;
  }
  const readAt = new Date();
  await prisma.$transaction([
    prisma.message.updateMany({
      where: { conversationId, readByAdmin: null },
      data: { readByAdmin: readAt }
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadForAdmin: 0 }
    })
  ]);
}

export { formatOrderReference };
