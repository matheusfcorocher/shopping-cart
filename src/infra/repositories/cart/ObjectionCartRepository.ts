import { v4 as uuidv4 } from "uuid";
import { Cart, Voucher } from "../../../domain/entities";
import { LineItem } from "../../../domain/entities/Cart";
import { VoucherType } from "../../../domain/entities/Voucher";
import { appliedFactory } from "../../../domain/factories/AppliedVoucherFactory";
import { CartRepository } from "../../../domain/repositories/CartRepository";
import { Owner } from "../../../domain/repositories/LineItemRepository";
import { AppliedVoucher } from "../../../domain/valueObjects/AppliedVoucher";
import { CartModel } from "../../database/knex/models";
import { ObjectionLineItemRepository } from "../lineItem/ObjectionLineItemRepository";
import { ObjectionCartMapper } from "./ObjectionCartMapper";

class ObjectionCartRepository implements CartRepository {
  public async delete(cart: Cart): Promise<string> {
    const { buyerId, id, lineItems } = cart;

    const lineItemsRepository = new ObjectionLineItemRepository();
    const owner = {
      ownerId: id,
      ownerType: "cart",
    };
    const promises = lineItems
      .map((l) => l.productId)
      .map((id) => lineItemsRepository.delete(owner, id));

    await Promise.all(promises);

    return CartModel.query()
      .delete()
      .where({
        buyerId,
        uuid: id,
      })
      .then(() => Promise.resolve("Cart was deleted successfully."))
      .catch((err) => {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cart with id ${id} and buyerId ${buyerId} can't be found.`;
        return Promise.reject(notFoundError);
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

  public update(cart: Cart): Promise<Cart> {
    const data = ObjectionCartMapper.toDatabase(cart);
    return CartModel.query()
      .patchAndFetch(data)
      .then((result) => {
        return this.transformCartModelToCart(result);
      });
  }

  private getLineItems(cartId: string): Promise<LineItem[]> {
    const repository = new ObjectionLineItemRepository();
    const owner: Owner = {
      ownerId: cartId,
      ownerType: "cart",
    };

    return repository.getAllLineItemsByOwner(owner);
  }

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

  private async transformCartModelToCart(cart: CartModel): Promise<Cart> {
    const lineItems = await this.getLineItems(cart.uuid);
    const appliedVoucher = this.getAppliedVoucher(cart);
    const additionalProps = {
      lineItems,
      appliedVoucher,
    };
    return ObjectionCartMapper.toEntity(cart, additionalProps);
  }
}

export { ObjectionCartRepository };
