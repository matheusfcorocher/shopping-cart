import { Product } from "../../../../../../../src/domain/entities";
import { createMoney } from "../../../../../../../src/domain/valueObjects/Money";
import { ProductSerializer } from "../../../../../../../src/interfaces/http/controllers/serializers/ProductSerializer";

describe("Interfaces :: HTTP :: Product :: ProductSerializer", () => {
  it("returns id, name, price and available", () => {
    const product = new Product({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      name: "Chocolate",
      price: createMoney(2999),
      available: 100,
    });

    const expected = {
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      name: "Chocolate",
      price: 29.99,
      available: 100,
    };

    expect(ProductSerializer.serialize(product)).toEqual(expected);
  });
});
