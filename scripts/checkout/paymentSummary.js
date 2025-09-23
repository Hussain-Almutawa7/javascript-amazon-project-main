import { cart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let totalPriceCents = 0;
  let shippingCents = 0;
  let totalPrice = 0;
  let shippingCost = 0;
  let totalPriceBeforeTax = 0;
  let EstimatedTax = 0;
  let totalPriceAfterTax = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    totalPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = deliveryOptions.find(
      (option) => option.id === cartItem.deliveryOptionId
    );

    if (deliveryOption) {
      shippingCents += deliveryOption.priceCents;
    }

    totalPrice = totalPriceCents;
    shippingCost = shippingCents;
    totalPriceBeforeTax = totalPriceCents + shippingCents;
    EstimatedTax = Math.round((totalPriceCents + shippingCents) * 0.1);
    totalPriceAfterTax = totalPriceBeforeTax + EstimatedTax;
  });

  const html = `
         <div class="payment-summary-title">
            Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${cart.updateCartQuantityNumber()}):</div>
                <div class="payment-summary-money">$${formatCurrency(
                  totalPrice
                )}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money js-shipping-price">$${formatCurrency(
                  shippingCost
                )}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurrency(
                  totalPriceBeforeTax
                )}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(
                  EstimatedTax
                )}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money js-total-price">$${formatCurrency(
                  totalPriceAfterTax
                )}</div>
            </div>

            <button class="place-order-button js-place-order-button button-primary">
                Place your order
            </button>
    `;

  const container = document.querySelector(".js-payment-summary");
  if (!container) return; // <- key line: skip if container missing

  container.innerHTML = html;

  const btn = document.querySelector(".js-place-order-button");
  const empty = cart.updateCartQuantityNumber() === 0;
  btn.disabled = empty;
  btn.classList.toggle("disable-place-order", empty);

  document
    .querySelector(".js-place-order-button")
    .addEventListener("click", async () => {
      if (cart.updateCartQuantityNumber() === 0) return;
      try {
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });

        const orders = await response.json();
        addOrder(orders);
      } catch (error) {
        console.log("Unexpected Error. Try again Later")
      }

      window.location.href = "orders.html"
    });
}
