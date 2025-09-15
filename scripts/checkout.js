import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js"
import { renderCheckoutHeader } from "./checkout/CheckoutHeader.js";
import ".././data/cart-oop.js"

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
})