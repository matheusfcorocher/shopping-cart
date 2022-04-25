import { DomainError } from "../../lib/errors/DomainError";
import { AppliedVoucher, applyDiscount } from "../valueObjects/AppliedVoucher";
import { createMoney, Money } from "../valueObjects/Money";

type Cart = {
  id: string;
  buyerId?: string;
  lineItems: LineItems;
  appliedVoucher?: AppliedVoucher;
};

type LineItem = {
  productId: string;
  unitPrice: Money;
  quantity: number;
};

type LineItems = Array<LineItem>;

type LineItemDataProps = {
  productId: string;
  price: Money;
};

//public functions

function createCart({ id, buyerId, lineItems, appliedVoucher }: Cart): Cart {
  return { id, buyerId, lineItems, appliedVoucher };
}

function createLineItem({
  productId,
  unitPrice,
  quantity,
}: LineItem): LineItem {
  return { productId, unitPrice, quantity };
}

function discount(cart: Cart): Money {
  return cart.appliedVoucher
    ? applyDiscount({
        subtotal: subtotal(cart),
        shipping: shipping(cart),
        appliedVoucher: cart.appliedVoucher,
      })
    : createMoney(0);
}

function subtotal(cart: Cart): Money {
  return cart.lineItems
    ? cart.lineItems.reduce(
        (acc: Money, item: LineItem) =>
          acc.add(item.unitPrice.multiply(item.quantity)),
        createMoney(0)
      )
    : createMoney(0);
}

function shipping(cart: Cart): Money {
  if (
    subtotal(cart).greaterThanOrEqual(createMoney(40000)) ||
    subtotal(cart).equalsTo(createMoney(0))
  ) {
    return createMoney(0);
  }
  const shippingWeight: number = calculateCartWeight(cart);
  if (shippingWeight <= 10) return createMoney(3000);

  return calculateShippingCost(shippingWeight);
}

function total(cart: Cart): Money {
  if (discount(cart).greaterThanOrEqual(subtotal(cart))) return shipping(cart);
  return subtotal(cart).add(shipping(cart)).subtract(discount(cart));
}

function addLineItem(cart: Cart, lineItemData: LineItemDataProps): Cart {
  const item = cart.lineItems.find(
    (item) => item.productId.normalize() === lineItemData.productId.normalize()
  );
  if (item) {
    const newItem: LineItem = {
      ...item,
      quantity: item.quantity + 1,
    };
    const index = cart.lineItems.findIndex(
      (lineItem) =>
        lineItem.productId.normalize() === lineItemData.productId.normalize()
    );
    const newlineItems = [
      ...cart.lineItems.slice(0, index),
      newItem,
      ...cart.lineItems.slice(index + 1),
    ];
    return {
      ...cart,
      lineItems: newlineItems,
    };
  } else {
    const newLineItem = createLineItem({
      productId: lineItemData.productId,
      unitPrice: lineItemData.price,
      quantity: 1,
    });
    const lineItems = [...cart.lineItems, newLineItem];
    return {
      ...cart,
      lineItems,
    };
  }
}

function applyVoucher(cart: Cart, appliedVoucher: AppliedVoucher): Cart {
  return {
    ...cart,
    appliedVoucher: appliedVoucher,
  };
}

function removeLineItem(cart: Cart, productId: string): Cart {
  const item = cart.lineItems.find(
    (item) => item.productId.normalize() === productId.normalize()
  );
  if (item) {
    const newItem: LineItem = {
      ...item,
      quantity: item.quantity - 1,
    };
    const index = cart.lineItems.findIndex(
      (lineItem) => lineItem.productId.normalize() === productId.normalize()
    );
    if (item.quantity <= 0) {
      cart.lineItems.splice(index, 1);
      const newlineItems = [
        ...cart.lineItems.slice(0, index),
        ...cart.lineItems.slice(index + 1),
      ];
      return {
        ...cart,
        lineItems: newlineItems,
      };
    } else {
      const newlineItems = [
        ...cart.lineItems.slice(0, index),
        newItem,
        ...cart.lineItems.slice(index + 1),
      ];
      return {
        ...cart,
        lineItems: newlineItems,
      };
    }
  } else {
    throw DomainError.create({
      name: "Not Found Error",
      code: "NOTFOUND_ERROR",
      message: `Item with productId ${productId} wasn't found in cart!`,
    });
  }
}

function removeVoucher(cart: Cart): Cart {
  return {
    ...cart,
    appliedVoucher: undefined,
  };
}

//private functions

function calculateCartWeight(cart: Cart): number {
  return cart.lineItems
    ? cart.lineItems.reduce(
        (acc: number, item: LineItem) => acc + item.quantity,
        0
      )
    : 0;
}

function calculateShippingCost(weight: number): Money {
  //If weight is above 10kg, will charge $7 for each
  //5kg that cart has
  return createMoney(weight)
    .subtract(createMoney(10))
    .divide(5)
    .multiply(700)
    .add(createMoney(3000));
}

export { Cart, LineItems, LineItem };

export {
  createCart,
  createLineItem,
  discount,
  subtotal,
  shipping,
  total,
  addLineItem,
  applyVoucher,
  removeLineItem,
  removeVoucher,
};
