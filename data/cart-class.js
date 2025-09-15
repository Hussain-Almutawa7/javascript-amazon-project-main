import { deliveryOptions } from "./deliveryOptions.js";

class Cart {
  cartItems;
  localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2",
        },
      ];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
    let matchingItem;
    const el = document.querySelector(`.js-quantity-selector-${productId}`);
    const amountAdded = Number(el ? el.value : 1);

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += amountAdded;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: amountAdded,
        deliveryOptionId: "1",
      });
    }

    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;

    this.saveToStorage();
  }

  updateCartQuantityNumber() {
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    const matchingItem = this.cartItems.find(
      (item) => item.productId === productId
    );
    matchingItem.quantity = newQuantity;

    this.saveToStorage();
  }

  updateDeliverOption(productId, deliveryOptionId) {
    const matchingItem = this.cartItems.find(
      (cartItem) => productId === cartItem.productId
    );

    if (!matchingItem) return;

    const matchingDeliveryOptionId = deliveryOptions.find(
      (deliveryOption) => deliveryOptionId === deliveryOption.id
    );

    if (!matchingDeliveryOptionId) return;

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}

const cart = new Cart("cart-oop");
const businessCart = new Cart("cart-business");

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
