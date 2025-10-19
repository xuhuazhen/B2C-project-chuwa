import { createSelector } from '@reduxjs/toolkit';
 
export const cartsItem = (state) => state.cart.items;
export const discountRate = (state) => state.cart.discountRate;
export const promoCode = (state) => state.cart.promoCode;
 
export const totalCartItem = createSelector(cartsItem, (items) => {
  if (!items?.length) return 0;
  return items.reduce((sum, i) => sum + i.quantity, 0);
});
 
export const subTotalPrice = createSelector(cartsItem, (items) => {
  if (!items?.length) return 0;
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  return total.toFixed(2);
});

// calculate with tax
export const totalTax = createSelector(subTotalPrice, (subtotal) => {

  return subtotal > 0 ? (subtotal*0.092).toFixed(2) : 0;
});

export const discountAmount = createSelector(subTotalPrice, discountRate, (subTotalPrice, discount) => {
    return discount > 0 ? (subTotalPrice * discount).toFixed(2) : 0;
})

// 含税总价
export const totalPrice = createSelector(subTotalPrice, totalTax, discountAmount, (subtotal, tax, discount) => {
  console.log(subtotal)
    return subtotal > 0 ? (parseFloat(subtotal) + parseFloat(tax) - parseFloat(discount)).toFixed(2) : 0;
});