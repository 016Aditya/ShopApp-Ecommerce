const ORDER_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="16" fill="#e5e7eb"/>
      <path d="M30 33h36l-4 30H34l-4-30Z" fill="#cbd5e1"/>
      <path d="M38 42h20" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
      <path d="M42 27a6 6 0 0 1 12 0" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
  `);

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeOrderItem = (item = {}, index = 0) => {
  const product = item.product ?? item.productDto ?? item.productResponse ?? {};

  const quantity = toNumber(pickFirst(item.quantity, item.qty), 0);
  const unitPrice = toNumber(
    pickFirst(item.unitPrice, item.price, item.productPrice, product.price),
    0
  );

  const normalized = {
    id: pickFirst(item.id, item.orderItemId, `${pickFirst(item.productId, product.id, "item")}-${index}`),
    productId: pickFirst(item.productId, product.id, item.id, `item-${index}`),
    productName: pickFirst(
      item.productName, 
      item.name, 
      item.title,
      product.name, 
      product.title,
      product.productName,
      "Product"
    ),
    imageUrl: pickFirst(
      item.imageUrl,
      item.productImage,
      item.productImageUrl,
      item.image,
      item.thumbnail,
      product.imageUrl,
      product.image,
      product.thumbnail,
      product.productImage,
      ORDER_IMAGE_PLACEHOLDER
    ),
    quantity: Math.max(quantity, 1),
    unitPrice,
    totalPrice: toNumber(
      pickFirst(item.totalPrice, item.lineTotal, quantity ? unitPrice * quantity : unitPrice),
      unitPrice * quantity
    ),
    raw: item,
  };

  return normalized;
};

const normalizeAddress = (address = {}) => ({
  name: pickFirst(address.name, address.fullName, address.recipientName, address.customerName, ""),
  phone: pickFirst(address.phone, address.phoneNumber, address.mobile, ""),
  email: pickFirst(address.email, ""),
  line1: pickFirst(address.line1, address.addressLine1, address.street, address.address, ""),
  line2: pickFirst(address.line2, address.addressLine2, address.landmark, ""),
  city: pickFirst(address.city, address.town, ""),
  state: pickFirst(address.state, address.region, ""),
  zipCode: pickFirst(address.zipCode, address.postalCode, address.pincode, ""),
  country: pickFirst(address.country, ""),
});

export const normalizeOrder = (order = {}) => {
  // Try multiple field names for items array
  const rawItems = pickFirst(
    order.items,
    order.orderItems, 
    order.products,
    order.lineItems,
    order.cartItems,
    order.itemList,
    order.orderItemList,
    []
  );
  
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeOrderItem) : [];

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    id: pickFirst(order.id, order.orderId, order._id, ""),
    createdAt: pickFirst(order.createdAt, order.orderDate, order.placedAt, order.updatedAt, null),
    status: pickFirst(order.status, order.orderStatus, "PENDING"),
    quantity: toNumber(pickFirst(order.quantity, order.totalQuantity), totalQuantity),
    totalPrice: toNumber(
      pickFirst(order.totalPrice, order.totalAmount, order.grandTotal, order.orderTotal),
      itemsSubtotal
    ),
    subtotal: toNumber(pickFirst(order.subtotal, order.itemsTotal), itemsSubtotal),
    shippingPrice: toNumber(pickFirst(order.shippingPrice, order.shippingAmount, order.deliveryFee), 0),
    taxPrice: toNumber(pickFirst(order.taxPrice, order.taxAmount, order.gst), 0),
    address: normalizeAddress(pickFirst(order.address, order.shippingAddress, order.deliveryAddress, {})),
    items,
    raw: order,
  };
};

export const normalizeOrdersResponse = (payload) => {
  const rawOrders = Array.isArray(payload)
    ? payload
    : pickFirst(payload?.orders, payload?.content, payload?.data, []);

  return Array.isArray(rawOrders) ? rawOrders.map(normalizeOrder) : [];
};

export { ORDER_IMAGE_PLACEHOLDER };
