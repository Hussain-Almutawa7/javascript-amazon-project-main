import { cart } from "../../data/cart.js";

export function renderCheckoutHeader() {
  const count = cart.updateCartQuantityNumber();

  const checkoutEl = document.querySelector(".checkout-header-middle-section");
  if (checkoutEl) {
    checkoutEl.innerHTML = `
      Checkout (<a class="return-to-home-link js-checkout-link"
          href="amazon.html">${count} items</a>)
    `;
  }

  const cartQtyEl = document.querySelector(".js-cart-quantity");
  if (cartQtyEl) {
    cartQtyEl.innerHTML = count;
  }
}
