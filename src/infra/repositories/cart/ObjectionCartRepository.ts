import { v4 as uuidv4 } from "uuid";
import { transaction } from "objection";
import { Cart, Voucher } from "../../../domain/entities";
import { LineItem } from "../../../domain/entities/Cart";
import { appliedFactory } from "../../../domain/factories/AppliedVoucherFactory";
import { VoucherType } from "../../../domain/entities/Voucher";
import { CartRepository } from "../../../domain/repositories/CartRepository";
import { AppliedVoucher } from "../../../domain/valueObjects/AppliedVoucher";
import { ObjectionLineItemMapper } from "../lineItem/ObjectionLineItemMapper";
import { ObjectionCartMapper } from "./ObjectionCartMapper";
import { CartModel } from "../../database/knex/models/CartModel";
import { LineItemModel } from "../../database/knex/models/LineItemModel";
import { InfrastructureError } from "../../../lib/CustomError";
import { createMoney } from "../../../domain/valueObjects/Money";
interface Owner {
  ownerId: string;
  ownerType: string;
}

interface LineItemProps {
  productId: string;
  unitPrice?: number;
  quantity?: number;
}
class ObjectionCartRepository implements CartRepository {
  //public methods

  public async delete(cart: Cart): Promise<string> {
    return transaction(CartModel, async (BoundCartModel) => {
      const { buyerId, id, lineItems } = cart;

      const productIds = lineItems.map((l) => l.productId);

      const boundCartModel = await this.getCartModelById(id, BoundCartModel);

      await this.deleteLineItems(productIds, boundCartModel);

      return boundCartModel
        .$query()
        .delete()
        .then(() => "Cart was deleted successfully.")
        .catch(() => {
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Cart with id ${id} and buyerId ${buyerId} can't be found.`,
          });
          return Promise.reject(notFoundError);
        });
    });
  }

  public getAllCarts(): Promise<Cart[]> {
    return CartModel.query().then((data) =>
      Promise.all(
        data.map((d) => {
          return this.transformCartModelToCart(d);
        })
      )
    );
  }
  public getCartById(id: string): Promise<Cart> {
    return CartModel.query()
      .findOne({
        uuid: id,
      })
      .then((data) => {
        if (!data) throw new Error("Cart Model is undefined.");
        return this.transformCartModelToCart(data!);
      })
      .catch((err) => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Couldn't find cart with id: ${id} in database. Verify if you are passing the correct id.`,
          detail: err.message,
        });
        throw notFoundError;
      });
  }
  public getCartByBuyerId(buyerId: string): Promise<Cart> {
    return CartModel.query()
      .findOne({
        buyerId,
      })
      .then((data) => {
        if (!data) throw new Error("Cart Model is undefined.");
        return this.transformCartModelToCart(data!);
      })
      .catch((err) => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Couldn't find cart with buyerId: ${buyerId} in database. Verify if you are passing the correct buyerId.`,
          detail: err.message,
        });
        throw notFoundError;
      });
  }
  public getNextId(): string {
    return uuidv4();
  }

  public async update(cart: Cart): Promise<Cart> {
    return transaction(CartModel, async (BoundCartModel) => {
      const { id, lineItems } = cart;
      const cartDb = await this.getCartById(id);
      const boundCartModel = await this.getCartModelById(id, BoundCartModel);

      const promises2 = lineItems.map(async (lineItem) => {
        const itemDb = cartDb.lineItems.find(
          (item) => item.productId === lineItem.productId
        );

        if (!itemDb) {        
          return this.storeLineItem(lineItem, boundCartModel);
        }
        
        return 'ok';
      });

      const promises = cartDb.lineItems.map(async (lineItem) => {
        const itemCart = lineItems.find(
          (item) => item.productId === lineItem.productId
        );

        if (!itemCart) {
          return this.deleteLineItem(lineItem.productId, boundCartModel);
        } else if (itemCart) {
          const { unitPrice, quantity, productId } = itemCart;
          return this.updateLineItem(
            {
              unitPrice: unitPrice.getAmount(),
              quantity,
              productId,
            },
            boundCartModel
          );
        }
      });

      await Promise.all([promises, promises2]);
      const data = ObjectionCartMapper.toDatabase(cart);

      return boundCartModel
        .$query()
        .patchAndFetch(data)
        .then((result) => {
          return this.transformCartModelToCart(result);
        });
    });
  }

  //private methods

  private getCartModelById(
    id: string,
    cartModel = CartModel
  ): Promise<CartModel> {
    return cartModel
      .query()
      .findOne({
        uuid: id,
      })
      .then((data) => {
        return data!;
      })
      .catch((err) => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Cart with id ${id} can't be found.`,
          detail: err.message,
        });
        return Promise.reject(notFoundError);
      });
  }

  private async deleteLineItem(
    productId: string,
    cartModel: CartModel
  ): Promise<String> {
    return cartModel
      .$relatedQuery("lineItems")
      .where({ productId })
      .delete()
      .then(() => Promise.resolve("LineItem was deleted successfully."))
      .catch(() => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `LineItem with productId ${productId} can't be found.`,
        });
        return Promise.reject(notFoundError);
      });
  }

  private async deleteLineItems(
    productIds: Array<string>,
    cartModel: CartModel
  ): Promise<String> {
    return cartModel
      .$relatedQuery("lineItems")
      .whereIn("productId", productIds)
      .delete()
      .then(() => Promise.resolve("LineItems was deleted successfully."))
      .catch(() => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `LineItems can't be found.`,
        });
        return Promise.reject(notFoundError);
      });
  }

  private getAllLineItemsByOwner(owner: Owner): Promise<LineItem[]> {
    return this.getAllLineItemsModelsByOwner(owner).then((data) =>
      data.map((d) => ObjectionLineItemMapper.toEntity(d))
    );
  }

  private async transformCartModelToCart(cart: CartModel): Promise<Cart> {
    const owner: Owner = {
      ownerId: cart.uuid,
      ownerType: "cart",
    };
    const lineItems = await this.getAllLineItemsByOwner(owner);
    const appliedVoucher = this.getAppliedVoucher(cart);
    const additionalProps = {
      lineItems,
      appliedVoucher,
    };
    return ObjectionCartMapper.toEntity(cart, additionalProps);
  }

  private async updateLineItem(
    data: LineItemProps,
    cartModel: CartModel
  ): Promise<String> {
    return cartModel
      .$relatedQuery("lineItems")
      .where({ productId: data.productId })
      .update(data)
      .then(() => `LineItem was updated`);
  }

  //private methods - dead ends

  private getAppliedVoucher(cartModel: CartModel): AppliedVoucher | undefined {
    const { voucherId, type, amount, minValue } = cartModel;
    if (voucherId && type && (amount || minValue)) {
      const voucherType = <VoucherType>type;
      const voucher = new Voucher({
        id: voucherId,
        code: "null",
        type: voucherType,
        amount: amount ? createMoney(amount) : undefined,
        minValue: minValue ? createMoney(minValue) : undefined,
      });
      return appliedFactory.fromVoucher(voucher);
    }

    return undefined;
  }

  private getLineItemsModelByOwnerAndProductId(
    owner: Owner,
    productId: string,
    lineItemModel: typeof LineItemModel
  ): Promise<LineItemModel> {
    const { ownerId, ownerType } = owner;
    return lineItemModel
      .query()
      .findOne({
        productId,
        ownerId,
        ownerType,
      })
      .then((data) => {
        if (data === undefined) {
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`,
          });
          return Promise.reject(notFoundError);
        }
        return data;
      });
  }

  private getAllLineItemsModelsByOwner(owner: Owner): Promise<LineItemModel[]> {
    const { ownerId, ownerType } = owner;

    return LineItemModel.query()
      .where({
        ownerId,
        ownerType,
      })
      .then((data) => {
        if (data === undefined) {
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Line with ownerId ${ownerId} can't be found for ${ownerType}.`,
          });
          return Promise.reject(notFoundError);
        }
        return data;
      });
  }

  private hasLineItem(
    productId: string,
    cartModel: CartModel
  ): Promise<boolean> {
    return cartModel
      .$relatedQuery("lineItems")
      .findOne({
        productId,
      })
      .then((d) => (d ? true : false))
      .catch(() => false);
  }

  private storeLineItem(
    lineItem: LineItem,
    cartModel: CartModel
  ): Promise<String> {
    const uuid = this.getNextId();
    const { productId, unitPrice, quantity } = lineItem;
    const data = {
      uuid,
      productId,
      unitPrice: unitPrice.getAmount(),
      quantity,
    };
    return cartModel
      .$relatedQuery("lineItems")
      .insert(data)
      .then(() => "LineItem was created with success!");
  }
}

export default ObjectionCartRepository;
