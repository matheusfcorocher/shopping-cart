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
          const notFoundError = new Error("Not Found Error");
          //   notFoundError.CODE = "NOTFOUND_ERROR";
          notFoundError.message = `Cart with id ${id} and buyerId ${buyerId} can't be found.`;
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
        return this.transformCartModelToCart(data!);
      })
      .catch((err) => {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cart with id ${id} can't be found.`;
        return Promise.reject(notFoundError);
      });
  }
  public getCartByBuyerId(buyerId: string): Promise<Cart> {
    return CartModel.query()
      .findOne({
        buyerId,
      })
      .then((data) => {
        return this.transformCartModelToCart(data!);
      })
      .catch((err) => {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cart with buyerId ${buyerId} can't be found.`;
        return Promise.reject(notFoundError);
      });
  }
  public getNextId(): string {
    return uuidv4();
  }

  public async update(cart: Cart): Promise<Cart> {
    return transaction(CartModel, async (BoundCartModel) => {
      const { id, lineItems } = cart;
      
      const boundCartModel = await this.getCartModelById(id, BoundCartModel);
      
      const promises = lineItems.map(async (lineItem) => {
        const hasLineItem = await this.hasLineItem(
          lineItem.productId,
          boundCartModel
        );

        if (hasLineItem && lineItem.quantity == 0) {
          return this.deleteLineItem(lineItem.productId, boundCartModel);
        }
        else if (hasLineItem && lineItem.quantity > 0) {
          const { unitPrice, quantity, productId } = lineItem;
          return this.updateLineItem(
            {
              unitPrice,
              quantity,
              productId,
            },
            boundCartModel
          );
        } else return this.storeLineItem(lineItem, boundCartModel);
      });
      
      await Promise.all(promises);
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
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cart with id ${id} can't be found.`;
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
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `LineItem with productId ${productId} can't be found.`;
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
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `LineItems can't be found.`;
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
    if (voucherId && type && amount) {
      const voucherType = <VoucherType>type;
      const voucher = new Voucher({
        id: voucherId,
        code: "null",
        type: voucherType,
        amount,
        minValue,
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
          const notFoundError = new Error("Not Found Error");
          //   notFoundError.CODE = "NOTFOUND_ERROR";
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;
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
          const notFoundError = new Error("Not Found Error");
          //   notFoundError.CODE = "NOTFOUND_ERROR";
          notFoundError.message = `Line with ownerId ${ownerId} can't be found for ${ownerType}.`;
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
      .then((d) => d?true:false)
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
      unitPrice,
      quantity,
    };
    return cartModel
      .$relatedQuery("lineItems")
      .insert(data)
      .then(() => "LineItem was created with success!");
  }
}

export { ObjectionCartRepository };
