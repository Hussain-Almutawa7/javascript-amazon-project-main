import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/CheckoutHeader.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
//import ".././data/cart-oop.js"
//import ".././data/cart-class.js";
//import "../data/backend-practice.js";

document.addEventListener("DOMContentLoaded", () => {
  /*
  loadProductsFetch().then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
  });
  */

  async function loadPage() {

    await loadProductsFetch();

    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
  }

  loadPage();

  /*
  loadPage().then(() => {
    console.log("Next Step");
  });

  Promise.all([
    loadProductsFetch().then(() => {
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    }),
  ]);
  */

  /*
  loadProducts(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
  });
  */
});
