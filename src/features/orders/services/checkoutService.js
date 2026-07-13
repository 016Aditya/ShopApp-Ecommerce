import api from '@/api/api'; // Adjust this if your api is in a different spot!

export const submitCheckout = ({ userId, items, address }) => {
  const productQuantities = items.reduce((acc, item) => {
    acc[item.productId] = item.quantity;
    return acc;
  }, {});

  return api
    .post('/orders/checkout', { userId, productQuantities, address })
    .then((res) => res.data);
};