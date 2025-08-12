import {cart, removeFromCart, updateCartQuantityNumber, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

document.addEventListener("DOMContentLoaded", () => {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input" type="number" min = 0 data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link-primary" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        document.querySelector(".js-checkout-link").innerHTML = updateCartQuantityNumber() + "items";
      });
    });

    document.querySelector(".js-checkout-link").innerHTML = updateCartQuantityNumber();

    document.querySelectorAll(".js-link-primary").forEach(link => { // Update Link
      link.addEventListener("click", () => {
        const {productId} = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add("is-editing-quantity");

        const input = container.querySelector(".js-quantity-input");
        const quantityLabel = container.querySelector(".js-quantity-label");

        input.value = Number(quantityLabel.textContent);

      })
    })

    function editCheckoutItems(productId) {
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
        let checkoutLink = document.querySelector(".js-checkout-link");
        container.classList.remove("is-editing-quantity");

        const input = container.querySelector(".js-quantity-input");
        const quantityLabel = container.querySelector(".js-quantity-label");

        const newQuantity = Number(input.value);
        if (newQuantity === 0) {
          removeFromCart(productId);
          checkoutLink.innerHTML = `${updateCartQuantityNumber()} items`; 
          container.remove();
        } else if (newQuantity < 1000) {
            updateQuantity(productId, newQuantity);

            quantityLabel.textContent = newQuantity;
            input.value = newQuantity;

            checkoutLink.innerHTML = `${updateCartQuantityNumber()} items`;      
        } else {
            alert("Invalid Input");
            return;
          }
    }

    document.querySelectorAll(".js-save-link-primary").forEach(link => { // Save Link
      link.addEventListener("click", () => {
        const {productId} = link.dataset;
        editCheckoutItems(productId);
      })
  })

  document.querySelectorAll(".js-quantity-input").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const {productId} = input.dataset;
        editCheckoutItems(productId);
      }
    })
  });

  document.querySelector(".js-checkout-link").innerHTML = `${updateCartQuantityNumber()} items`;
})