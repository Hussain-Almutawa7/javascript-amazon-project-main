import { orders } from "../data/orders.js";
import { cart } from "../data/cart.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { renderCheckoutHeader } from "./checkout/CheckoutHeader.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadProductsFetch();
  renderMyOrders();
  renderCheckoutHeader();
  //console.log(orders);

  function renderMyOrders() {
    if (!orders.length) {
      document.querySelector(".js-order-container").innerHTML =
        "<p>You have no orders yet.</p>";
      return;
    }

    let myOrderHtml = ``;

    orders.forEach((order) => {
      const matchingProduct = getProduct(order.id);
      /**
       {
        id: "c4f53aba-bf3e-41a5-bc2d-488d31ae176d",
        orderTime: "2025-09-24T19:55:04.549Z",
        totalCostCents: 1199,
        products: [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          estimatedDeliveryTime: "2025-10-01T19:55:04.549Z",
          variation: null
        }
      ]
    }
       */
      const date = dayjs(order.orderTime).format("MMMM D");

      myOrderHtml += `
        <div class="order-header">
            <div class="order-header-left-section">
                <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${date}</div>
                </div>
                <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
            </div>

            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
            </div>
            </div>
            `;

      order.products.forEach((item) => {
        const product = getProduct(item.productId);
        if (!product) return;

        let dateString = item.estimatedDeliveryTime
          ? dayjs(item.estimatedDeliveryTime).format("MMM D")
          : "";

        myOrderHtml += `
           <div class="order-details-grid">
            <div class="product-image-container">
              <img src="${product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">${product.name}</div>
              <div class="product-delivery-date">Arriving on: ${dateString}</div>
              <div class="product-quantity">Quantity: ${item.quantity}</div>
              <button
                class="buy-again-button js-buy-again-button button-primary"
                data-product-id="${product.id}"
              >
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary js-track-package-button">
                  Track package
                </button>
              </a>
            </div>
          </div>
          <br>
        `;
      });
    });

    document.querySelector(".js-order-container").innerHTML = myOrderHtml;
  }

  document.querySelectorAll(".js-buy-again-button").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      if (!productId) return;
      cart.addToCart(productId);
      renderCheckoutHeader();
    });
  });

  document.querySelectorAll(".js-track-package-button").forEach(button => {
    button.addEventListener("click", () => {
      
    })
  })
});
