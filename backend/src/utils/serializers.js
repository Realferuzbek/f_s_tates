export function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    rating: product.rating !== null ? Number(product.rating) : null,
    inventory: product.inventory
      ? {
          ...product.inventory,
          quantity: product.inventory.quantity
        }
      : null
  };
}

export function serializeOrder(order) {
  return {
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      product: item.product ? serializeProduct(item.product) : null
    }))
  };
}
