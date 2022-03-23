import { v4 as uuidv4 } from "uuid";
import { transaction } from "objection";
import { Cart, Voucher } from "../../../domain/entities";
import { LineItem } from "../../../domain/entities/Cart";
import { VoucherType } from "../../../domain/entities/Voucher";
import { appliedFactory } from "../../../domain/factories/AppliedVoucherFactory";
import { CartRepository } from "../../../domain/repositories/CartRepository";
import { AppliedVoucher } from "../../../domain/valueObjects/AppliedVoucher";
import { CartModel, LineItemModel } from "../../database/knex/models";
import { ObjectionLineItemMapper } from "../lineItem/ObjectionLineItemMapper";
import { ObjectionCartMapper } from "./ObjectionCartMapper";
interface Owner {
  ownerId: string;
  ownerType: string;
}

interface LineItemProps {
  unitPrice?: number;
  quantity?: number;
}
class ObjectionCartRepository implements CartRepository {
  //public methods

  public async delete(cart: Cart): Promise<string> {
    // return transaction(
    //   CartModel,
    //   LineItemModel,
    //   async (CartModel, LineItemModel) => {
    const { buyerId, id, lineItems } = cart;

    const owner = {
      ownerId: id,
      ownerType: "cart",
    };
    const promises = lineItems.map((l) =>
      this.deleteLineItem(owner, l.productId, LineItemModel)
    );
    await Promise.all(promises);

    return CartModel.query()
      .delete()
      .where({
        buyerId,
        uuid: id,
      })
      .then(() => "Cart was deleted successfully.")
      .catch(() => {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cart with id ${id} and buyerId ${buyerId} can't be found.`;
        return Promise.reject(notFoundError);
      });
    // }
    // );
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
    return Promise.resolve(cart);
    // return transaction(
    //   CartModel,
    //   LineItemModel,
    //   async (CartModel, LineItemModel) => {
    //     const { id, lineItems } = cart;
    //     const owner = {
    //       ownerId: id,
    //       ownerType: "cart",
    //     };
    //     const promises = lineItems.map(async (l) => {
    //       const hasLineItem = await this.hasLineItem(
    //         owner,
    //         l.productId,
    //         LineItemModel
    //       );
    //       if (hasLineItem && l.quantity == 0)
    //         return this.deleteLineItem(owner, l.productId, LineItemModel);
    //       else if (hasLineItem && l.quantity > 0) {
    //         return this.updateLineItem(
    //           owner,
    //           l.productId,
    //           {
    //             unitPrice: l.unitPrice,
    //             quantity: l.quantity,
    //           },
    //           LineItemModel
    //         );
    //       } else return this.storeLineItem(l, owner, LineItemModel);
    //     });

    //     await Promise.all(promises);

    //     const data = ObjectionCartMapper.toDatabase(cart);
    //     return CartModel.query()
    //       .patchAndFetch(data)
    //       .then((result) => {
    //         return this.transformCartModelToCart(result);
    //       });
    //   }
    // );
  }

  //private methods

  private async deleteLineItem(
    owner: Owner,
    productId: string,
    lineItemModel: typeof LineItemModel
  ): Promise<String> {
    const lineItem = await this.getLineItemsModelByOwnerAndProductId(
      owner,
      productId,
      lineItemModel
    );
    const id = lineItem.id;

    return lineItem
      .$query()
      .delete()
      .where({
        id,
      })
      .then(() => Promise.resolve("LineItem was deleted successfully."));
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
    owner: Owner,
    productId: string,
    data: LineItemProps,
    lineItemModel: typeof LineItemModel
  ): Promise<LineItem> {
    const lineItem = await this.getLineItemsModelByOwnerAndProductId(
      owner,
      productId,
      lineItemModel
    );

    return lineItem
      .$query()
      .patchAndFetch(data)
      .then((result) => ObjectionLineItemMapper.toEntity(result));
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
    owner: Owner,
    productId: string,
    lineItemModel: typeof LineItemModel
  ): Promise<boolean> {
    const { ownerId, ownerType } = owner;
    return lineItemModel
      .query()
      .findOne({
        productId,
        ownerId,
        ownerType,
      })
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  }

  private storeLineItem(
    lineItem: LineItem,
    owner: Owner,
    lineItemModel: typeof LineItemModel
  ): Promise<LineItem> {
    const uuid = this.getNextId();
    const { ownerId, ownerType } = owner;

    return lineItemModel
      .query()
      .insertAndFetch(
        ObjectionLineItemMapper.toDatabase(lineItem, {
          uuid,
          ownerId,
          ownerType,
        })
      )
      .then((data) => {
        return ObjectionLineItemMapper.toEntity(data);
      });
  }
}

export { ObjectionCartRepository };
