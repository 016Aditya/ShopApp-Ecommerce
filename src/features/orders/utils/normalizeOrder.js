/**
 * normalizeOrder.js
 *
 * Single source of truth for mapping ANY backend order shape
 * into the consistent frontend shape consumed by all order components.
 *
 * Field extraction priority mirrors observed Spring Boot response shapes:
 *   order.orderItems[].product.name
 *   order.orderItems[].product.imageUrl
 *   order.orderItems[].productName  (flat variant)
 *   order.items[].product.*         (alternate key)
 *
 * NOTE: `raw` fields have been intentionally removed to prevent
 * sensitive order/address data from leaking into the console or
 * React DevTools in production builds.
 */

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

const pickFirst = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "");

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const extractProductName = (item = {}) => {
  const nested =
    item.product ?? item.productDto ?? item.productResponse ?? item.productInfo ?? {};

  return (
    pickFirst(
      item.productName,
      item.name,
      item.title,
      nested.name,
      nested.productName,
      nested.title,
    ) ?? "Product"
  );
};

const extractImageUrl = (item = {}) => {
  const nested =
    item.product ?? item.productDto ?? item.productResponse ?? item.productInfo ?? {};

  return (
    pickFirst(
      item.imageUrl,
      item.productImage,
      item.productImageUrl,
      item.image,
      item.thumbnail,
      nested.imageUrl,
      nested.image,
      nested.thumbnail,
      nested.productImage,
      nested.images?.[0],
    ) ?? ORDER_IMAGE_PLACEHOLDER
  );
};

const extractUnitPrice = (item = {}) => {
  const nested =
    item.product ?? item.productDto ?? item.productResponse ?? item.productInfo ?? {};

  return toNumber(
    pickFirst(
      item.unitPrice,
      item.price,
      item.productPrice,
      item.sellingPrice,
      nested.price,
      nested.sellingPrice,
      nested.discountedPrice,
      nested.mrp,
    ),
    0
  );
};

const normalizeOrderItem = (item = {}, index = 0) => {
  const nested =
    item.product ?? item.productDto ?? item.productResponse ?? item.productInfo ?? {};

  const quantity   = Math.max(toNumber(pickFirst(item.quantity, item.qty, item.count), 1), 1);
  const unitPrice  = extractUnitPrice(item);
  const totalPrice = toNumber(
    pickFirst(item.totalPrice, item.lineTotal),
    unitPrice * quantity
  );

  return {
    id:          pickFirst(item.id, item.orderItemId, `${pickFirst(item.productId, nested.id, "item")}-${index}`),
    productId:   pickFirst(item.productId, nested.id, item.id, `item-${index}`),
    productName: extractProductName(item),
    imageUrl:    extractImageUrl(item),
    quantity,
    unitPrice,
    totalPrice,
    // raw field intentionally omitted — prevents data leaking to console/devtools
  };
};

const normalizeAddress = (address = {}) => ({
  name:    pickFirst(address.name, address.fullName, address.recipientName, address.customerName, ""),
  phone:   pickFirst(address.phone, address.phoneNumber, address.mobile, ""),
  email:   pickFirst(address.email, ""),
  line1:   pickFirst(address.line1, address.addressLine1, address.street, address.address, ""),
  line2:   pickFirst(address.line2, address.addressLine2, address.landmark, ""),
  city:    pickFirst(address.city, address.town, ""),
  state:   pickFirst(address.state, address.region, ""),
  zipCode: pickFirst(address.zipCode, address.postalCode, address.pincode, ""),
  country: pickFirst(address.country, "India"),
});

export const normalizeOrder = (order = {}) => {
  const rawItems = pickFirst(
    order.orderItems,
    order.items,
    order.products,
    order.lineItems,
    order.cartItems,
    order.itemList,
    order.orderItemList,
  );

  const items = Array.isArray(rawItems)
    ? rawItems.map(normalizeOrderItem)
    : [];

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const itemsSubtotal = items.reduce((s, i) => s + i.totalPrice, 0);

  return {
    id:            pickFirst(order.id, order.orderId, order._id, ""),
    createdAt:     pickFirst(order.createdAt, order.orderDate, order.placedAt, order.updatedAt, null),
    status:        pickFirst(order.status, order.orderStatus, "PENDING"),
    quantity:      toNumber(pickFirst(order.quantity, order.totalQuantity), totalQuantity || 1),
    totalPrice:    toNumber(pickFirst(order.totalPrice, order.totalAmount, order.grandTotal, order.orderTotal), itemsSubtotal),
    subtotal:      toNumber(pickFirst(order.subtotal, order.itemsTotal), itemsSubtotal),
    shippingPrice: toNumber(pickFirst(order.shippingPrice, order.shippingAmount, order.deliveryFee), 0),
    taxPrice:      toNumber(pickFirst(order.taxPrice, order.taxAmount, order.gst), 0),
    address:       normalizeAddress(pickFirst(order.address, order.shippingAddress, order.deliveryAddress, {})),
    items,
    // raw field intentionally omitted — prevents sensitive order data leaking to console/devtools
  };
};

export const normalizeOrdersResponse = (payload) => {
  const rawOrders = Array.isArray(payload)
    ? payload
    : pickFirst(payload?.orders, payload?.content, payload?.data, []);

  return Array.isArray(rawOrders) ? rawOrders.map(normalizeOrder) : [];
};

export { ORDER_IMAGE_PLACEHOLDER };
