import { v4 as uuidv4 } from "uuid";
import { LineItem } from "../../../domain/entities/Cart";
import {
  LineItemProps,
  LineItemRepository,
  Owner,
} from "../../../domain/repositories/LineItemRepository";
import { LineItemModel } from "../../database/knex/models";
import { ObjectionLineItemMapper } from "./ObjectionLineItemMapper";

class ObjectionLineItemRepository implements LineItemRepository {
  public async delete(owner: Owner, productId: string): Promise<String> {
    const { ownerId, ownerType } = owner;
    const lineItem = await this.getLineItemsModelByOwnerAndProductId(
      owner,
      productId
    );
    return lineItem
      .$query()
      .delete()
      .where({
        productId,
        ownerId,
        ownerType,
      })
      .then(() => Promise.resolve("LineItem was deleted successfully."));
  }

  public getAllLineItemsByOwner(owner: Owner): Promise<LineItem[]> {
    return this.getAllLineItemsModelsByOwner(owner).then((data) =>
      data.map((d) => ObjectionLineItemMapper.toEntity(d))
    );
  }

  public getNextId(): string {
    return uuidv4();
  }

  public store(lineItem: LineItem, owner: Owner): Promise<LineItem> {
    const uuid = this.getNextId();
    const { ownerId, ownerType } = owner;

    return LineItemModel.query()
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
  public async update(
    owner: Owner,
    productId: string,
    data: LineItemProps
  ): Promise<LineItem> {
    const lineItem = await this.getLineItemsModelByOwnerAndProductId(
      owner,
      productId
    );

    return lineItem
      .$query()
      .patchAndFetch(data)
      .then((result) => ObjectionLineItemMapper.toEntity(result));
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

  private getLineItemsModelByOwnerAndProductId(
    owner: Owner,
    productId: string
  ): Promise<LineItemModel> {
    const { ownerId, ownerType } = owner;
    return LineItemModel.query()
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
}

export { ObjectionLineItemRepository };
