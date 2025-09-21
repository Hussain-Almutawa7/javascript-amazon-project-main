import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/CheckoutHeader.js";
import { loadProducts } from "../data/products.js";
//import ".././data/cart-oop.js"
//import ".././data/cart-class.js";
//import "../data/backend-practice.js";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
  });
});
