import { cart } from "../../data/cart.js";

describe("test suite: addToCart", () => {
  beforeEach(() => {
    spyOn(localStorage, "setItem");
  });

  it("adds an existing product to the cart", () => {
    cart.cartItems = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "1",
      },
    ];

    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(2);
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
    cart.cartItems = [];

    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1);
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
    cart.cartItems = [
      { productId: productId1, quantity: 2, deliveryOptionId: "1" },
      { productId: productId2, quantity: 1, deliveryOptionId: "2" },
    ];

    cart.removeFromCart(productId1);

    expect(cart.cartItems.length).toBe(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);
    expect(cart.cartItems[0].quantity).toEqual(1);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        { productId: productId2, quantity: 1, deliveryOptionId: "2" },
      ])
    );
  });

  it("remove a productId that is not in the cart", () => {
    cart.cartItems = [
      { productId: productId1, quantity: 2, deliveryOptionId: "1" },
    ];

    cart.removeFromCart(productId2);

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].quantity).toEqual(2);
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
    cart.cartItems = [
      { productId: productId1, quantity: 1, deliveryOptionId: "1" },
    ];

    cart.updateDeliverOption(productId1, "3");

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("3");

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        { productId: productId1, quantity: 1, deliveryOptionId: "3" },
      ])
    );
  });

  it("update delivery option of a product ID that is not in the cart", () => {
    cart.cartItems = [
      { productId: productId1, quantity: 1, deliveryOptionId: "1" },
    ];

    cart.updateDeliverOption(productId2, "2");

    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("1");

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("use a deliveryOptionId that does not exist", () => {
    cart.cartItems = [
      { productId: productId1, quantity: 1, deliveryOptionId: "2" },
    ];

    cart.updateDeliverOption(productId1, "111");

    expect(cart.cartItems[0].deliveryOptionId).toEqual("2");
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
