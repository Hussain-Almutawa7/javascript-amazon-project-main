import { renderCheckoutHeader } from "../../scripts/checkout/CheckoutHeader.js";
import { loadFromStorage } from "../../data/cart.js";

describe("test suite: renderCheckoutHeader", () => {
  beforeEach(() => {
    // Reset test container before each spec
    document.querySelector(".js-test-container").innerHTML = `
      <div class="checkout-header-middle-section"></div>
    `;
  });

  afterEach(() => {
    // Clean up after each spec
    document.querySelector(".js-test-container").innerHTML = "";
  });

  it("displays total cart items in the header", () => {
    // Mock localStorage to simulate 3 items in cart
    spyOn(localStorage, "getItem").and.callFake((key) => {
      if (key === "cart") {
        return JSON.stringify([
          { productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", quantity: 2, deliveryOptionId: "1" },
          { productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d", quantity: 1, deliveryOptionId: "2" }
        ]);
      }
      return null;
    });

    loadFromStorage();

    // Call the function under test
    renderCheckoutHeader();

    // Grab the header element
    const header = document.querySelector(".checkout-header-middle-section");

    // Assertions
    expect(header).not.toBeNull();
    expect(header.textContent).toContain("3 items"); // 2 + 1 = 3
    expect(header.querySelector(".js-checkout-link").getAttribute("href"))
      .toBe("amazon.html");
  });
});
