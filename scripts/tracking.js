import { getOrder } from "../data/orders.js";
import { getProduct } from "../data/products.js";
import { loadProductsFetch } from "../data/products.js";
import { renderCheckoutHeader } from "./checkout/CheckoutHeader.js";
import { loadCartFetch } from "../data/cart.js";
import { setUpSearchBar } from "./amazonHeader.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadProductsFetch(), loadCartFetch()]);
  renderTrackingOrder();
  renderCheckoutHeader();
  setUpSearchBar();
});

function renderTrackingOrder() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getOrder(orderId);
  const productFromOrder = order.products.find(
    (item) => item.productId === productId
  );
  const product = getProduct(productFromOrder.productId);

  const date = dayjs(productFromOrder.estimatedDeliveryTime).format(
    "dddd, MMMM D"
  );

  let html = `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
            </a>

            <div class="delivery-date">
            Arriving on ${date}
            </div>

            <div class="product-info">
            ${product.name}
            </div>

            <div class="product-info">
            Quantity: ${productFromOrder.quantity}
            </div>

            <img class="product-image" src="${product.image}">

            <div class="progress-labels-container">
            <div class="progress-label js-prepare-color">
                Preparing
            </div>
            <div class="progress-label js-shipped-color">
                Shipped
            </div>
            <div class="progress-label js-delivered-color">
                Delivered
            </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar" style="width:${widthTrackingProgress()}%;"></div>
            </div>
        </div>
    `;
  document.querySelector(".js-main").innerHTML = html;

  function widthTrackingProgress() {
    const currentTime = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(productFromOrder.estimatedDeliveryTime);

    return Math.max(
      0,
      Math.min(
        100,
        Math.floor(
          ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100
        )
      )
    );
  }

  function trackProgress() {
    const preparing = document.querySelector(".js-prepare-color");
    const shipped = document.querySelector(".js-shipped-color");
    const delivered = document.querySelector(".js-delivered-color");
    const percent = widthTrackingProgress();

    const bar = document.querySelector(".js-progress-bar");
    if (bar) bar.style.width = percent + "%";

    if (preparing && shipped && delivered) {
      preparing.classList.toggle("current-status", percent < 50);
      shipped.classList.toggle(
        "current-status",
        percent >= 50 && percent < 100
      );
      delivered.classList.toggle("current-status", percent >= 100);
    }

    if (percent >= 1000) clearInterval(timer);
  }

  trackProgress();
  const timer = setInterval(trackProgress, 1000);
}
