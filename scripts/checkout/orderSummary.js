import {cart, removeFromCart, updateCartQuantityNumber, updateQuantity, updateDeliverOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryOptions, calculateDeliveryDate} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './CheckoutHeader.js';

export function renderOrderSummary() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
    const today = dayjs();
    const deliveryDate = calculateDeliveryDate(deliveryOption.deliveryDays, today);
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
            <div class="cart-item-container
            js-cart-item-container
            js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name js-product-name-${matchingProduct.id}">
                    ${matchingProduct.name}
                </div>
                <div class="product-price js-product-price-${matchingProduct.id}">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span>
                    Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-link-primary" data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input class="quantity-input js-quantity-input" type="number" min = 0 data-product-id="${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link-primary" data-product-id="${matchingProduct.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
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
        const deliveryDate = calculateDeliveryDate(deliveryOption.deliveryDays, today);
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

    document.querySelectorAll('.js-delete-link').forEach((link) => { // Delete Link
        link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        //document.querySelector(".js-checkout-link").innerHTML = updateCartQuantityNumber() + " items";
        renderCheckoutHeader();
        renderPaymentSummary()
        renderOrderSummary();
        });
    });

    //document.querySelector(".js-checkout-link").innerHTML = updateCartQuantityNumber();
    renderCheckoutHeader();

    document.querySelectorAll(".js-link-primary").forEach(link => { // Update Link
        link.addEventListener("click", () => {
        const {productId} = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add("is-editing-quantity");

        const input = container.querySelector(".js-quantity-input");
        const quantityLabel = container.querySelector(".js-quantity-label");

        input.value = Number(quantityLabel.textContent);
        renderPaymentSummary();
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
            //checkoutLink.innerHTML = `${updateCartQuantityNumber()} items`; 
            renderCheckoutHeader();
            container.remove();
        } else if (newQuantity < 1000) {
            updateQuantity(productId, newQuantity);

            quantityLabel.textContent = newQuantity;
            input.value = newQuantity;

            //checkoutLink.innerHTML = `${updateCartQuantityNumber()} items`;
            renderCheckoutHeader();      
        } else {
            alert("Invalid Input");
            return;
            }
            renderPaymentSummary();
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

    //document.querySelector(".js-checkout-link").innerHTML = `${updateCartQuantityNumber()} items`;
    renderCheckoutHeader();

    document.querySelectorAll(".js-delivery-option").forEach(option => {
        option.addEventListener("click", () => {
            const {productId, deliveryOptionId} = option.dataset;
            updateDeliverOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        })
    });

    function orderStatus() {
        const container = document.querySelector(".js-order-summary");
        container.innerHTML = "<p>Your cart is empty.</p>"

        const button = document.createElement("button");
        button.textContent = "View products";
        button.classList.add("button-primary");
        button.classList.add("extra-style");
        
        button.addEventListener("click", () => {
            window.location.href = "amazon.html"
        })

        container.appendChild(button);

    }
    
    if (updateCartQuantityNumber() === 0) {
        orderStatus();
    }
}