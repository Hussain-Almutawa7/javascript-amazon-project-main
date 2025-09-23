import { deliveryOptions } from "./deliveryOptions.js";
import { Cart } from "./cart-class.js";

export const cart = new Cart("cart");

export async function loadCartFetch() {
    const response = await fetch("https://supersimplebackend.dev/cart")
    const message = await response.text();
    console.log(message);
}
