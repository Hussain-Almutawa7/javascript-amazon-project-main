import { Product, Clothing, Appliance } from "../../data/products.js";

describe("test suit: Prdouct Class", () => {
  let sample;
  let p;
  beforeEach(() => {
    sample = {
      id: "p1",
      image: "image.png",
      name: "Hussain",
      rating: { stars: 4.5, counts: 120 },
      priceCents: 1299,
    };

    p = new Product(sample);
  });

  it("Check argument(Parameter) passed correctly", () => {
    expect(p.id).toBe("p1");
    expect(p.name).toBe("Hussain");
    expect(p.rating.stars).toBe(4.5);
    expect(p.rating.counts).toBe(120);
  });

  it("getStarsUrl build the correct path", () => {
    expect(p.getStarsUrl()).toBe("images/ratings/rating-45.png");
  });

  it("getPrice convert cents to dollar correctly", () => {
    expect(p.getPrice()).toBe("$12.99");
  });

  it("extraInfoHTML to return nothing", () => {
    expect(p.extraInfoHTML()).toBe("");
  });
});

describe("test suit: Clothing Class", () => {
  let sample;
  let p;
  beforeEach(() => {
    sample = {
      id: "p1",
      image: "image.png",
      name: "Hussain",
      rating: { stars: 4.5, counts: 120 },
      priceCents: 1299,
      sizeChartLink: "https://example.com/size",
    };

    p = new Clothing(sample);
  });

  it("sizeChartLink is unchanged", () => {
    expect(p.sizeChartLink).toBe(sample.sizeChartLink);
  });

  it("extraInfoHTML generate anchor tag with the corret sizeChartLink", () => {
    expect(p.extraInfoHTML()).toContain("Size Chart");
    expect(p.extraInfoHTML()).toContain(p.sizeChartLink);
  });
});

describe("test suit: Appliance", () => {
  let sample;
  let p;
  beforeEach(() => {
    sample = {
      id: "p1",
      image: "image.png",
      name: "Hussain",
      rating: { stars: 4.5, counts: 120 },
      priceCents: 1299,
      type: "appliances",
      instructionsLink: "images/appliance-instructions.png",
      warrantyLink: "images/appliance-warranty.png",
    };

    p = new Appliance(sample);
  });

  it("instructionsLink and warrantyLink is unchanged", () => {
    expect(p.instructionsLink).toBe(sample.instructionsLink);
    expect(p.warrantyLink).toBe(sample.warrantyLink);
  })

  it("extraInfoHTML mentions both links", () => {
    expect(p.extraInfoHTML()).toContain("Instructions");
    expect(p.extraInfoHTML()).toContain("Warranty.")
    expect(p.extraInfoHTML()).toContain(p.instructionsLink);
    expect(p.extraInfoHTML()).toContain(p.warrantyLink);
  })
});
