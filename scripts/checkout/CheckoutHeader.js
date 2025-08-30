import { updateCartQuantityNumber } from "../../data/cart.js";

export function renderCheckoutHeader() {
    let html = "";

    html += `
        Checkout (<a class="return-to-home-link js-checkout-link"
            href="amazon.html">${updateCartQuantityNumber()} items</a>)
    `

    document.querySelector(".checkout-header-middle-section").innerHTML = html;
}

