import {
  addToCart,
  cart,
  loadFromStorage,
  removeFromCart,
  updateDeliverOption
} from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { renderCheckoutHeader } from "../../scripts/checkout/CheckoutHeader.js";

describe("test suite: addToCart", () => {
  beforeEach(() => {
    spyOn(localStorage, "setItem");
  });

  it("adds an existing product to the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });
    loadFromStorage();

    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
      ])
    );
  });

  it("adds new product to the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ])
    );
  });
});

describe("test suite: removeFromCart", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeEach(() => {
    spyOn(localStorage, "setItem");
  });

  it("remove a productId that is in cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        { productId: productId1, quantity: 2, deliveryOptionId: "1" },
        { productId: productId2, quantity: 1, deliveryOptionId: "2" },
      ]);
    });
    loadFromStorage();

    removeFromCart(productId1);

    expect(cart.length).toBe(1);
    expect(cart[0].productId).toEqual(productId2);
    expect(cart[0].quantity).toEqual(1);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        { productId: productId2, quantity: 1, deliveryOptionId: "2" },
      ])
    );
  });

  it("remove a productId that is not in the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        { productId: productId1, quantity: 2, deliveryOptionId: "1" },
      ]);
    });
    loadFromStorage();

    removeFromCart(productId2);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].quantity).toEqual(2);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        { productId: productId1, quantity: 2, deliveryOptionId: "1" },
      ])
    );
  });
});

describe("test suite: updateDeliveryOption", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
      <div class="checkout-header-middle-section"></div>
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    spyOn(localStorage, "setItem");
  });

  afterEach(() => {
    document.querySelector(".js-test-container").innerHTML = "";
  });

  it("update delivery option for a product in the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        { productId: productId1, quantity: 1, deliveryOptionId: "1" },
      ]);
    });
    loadFromStorage();
    renderCheckoutHeader();
    renderOrderSummary();

    const input = document.querySelector(
      `.js-delivery-option-input-3-${productId1}`
    );
    input.click();

    expect(input.checked).toBeTrue();
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual("3");

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        { productId: productId1, quantity: 1, deliveryOptionId: "3" },
      ])
    );
  });

  it("update delivery option of a product ID that is not in the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        { productId: productId1, quantity: 1, deliveryOptionId: "1" },
      ]);
    });
    loadFromStorage();
    renderCheckoutHeader();
    renderOrderSummary();

    updateDeliverOption(productId2, "2");

    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual("1");

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
