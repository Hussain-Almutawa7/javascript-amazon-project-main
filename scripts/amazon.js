import { cart } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import { setUpSearchBar } from "./amazonHeader.js";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts(renderProductsGrid);
  setUpSearchBar();
});

function getProductPage() {
  const url = new URL(window.location.href);
  const item = url.searchParams.get("search");

  if (!item) return products

  return products.filter(product => {
    return product.name.toLowerCase().includes(item.toLowerCase()) ||
      Array.isArray(product.keywords) && product.keywords.some(kw => (kw || "").toLowerCase().includes(item.toLowerCase()))
  });

}

function renderProductsGrid() {
  const list = getProductPage();
  let productsHTML = "";

  list.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class = "js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      cart.addToCart(productId);
      updateCartQuantity();

      const addedToCartMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      addedToCartMessage.classList.add("visible");

      clearTimeout(addedToCartMessage.timeout);

      addedToCartMessage.timeout = setTimeout(() => {
        addedToCartMessage.classList.remove("visible");
      }, 2000);
    });
  });

  document.querySelector(".js-cart-quantity").innerHTML =
    cart.updateCartQuantityNumber();
}
