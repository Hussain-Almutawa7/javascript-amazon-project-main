import {cart, removeFromCart, updateCartQuantityNumber, updateQuantity, updateDeliverOption} from '../../data/cart.js';
import {products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryOptions} from "../../data/deliveryOptions.js";

export function renderOrderSummary() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
        matchingProduct = product;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
        <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
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
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
        </div>
    `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");

        const priceString = deliveryOption.priceCents === 0 ? 
        "FREE" : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        
        html += `
        <div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
            <input type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
            <div>
            <div class="delivery-option-date">
                ${dateString}
            </div>
            <div class="delivery-option-price">
                ${priceString} Shipping
            </div>
            </div>
        </div>
        `
    });

    return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        document.querySelector(".js-checkout-link").innerHTML = updateCartQuantityNumber() + " items";
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

    document.querySelectorAll(".js-delivery-option").forEach(option => {
        option.addEventListener("click", () => {
            const {productId, deliveryOptionId} = option.dataset;
            updateDeliverOption(productId, deliveryOptionId);
            renderOrderSummary();
        })
    });
    
}