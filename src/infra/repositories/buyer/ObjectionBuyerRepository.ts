import { v4 as uuidv4 } from "uuid";
import { Buyer } from "../../../domain/entities";
import { BuyerRepository } from "../../../domain/repositories/BuyerRepository";
import { InfrastructureError } from "../../../lib/CustomError";
import { BuyerModel } from "../../database/knex/models/BuyerModel";
import { ObjectionBuyerMapper } from "./ObjectionBuyerMapper";

class ObjectionBuyerRepository implements BuyerRepository {
  public getAllBuyers(): Promise<Buyer[]> {
    return BuyerModel.query().then((data) =>
      data.map((d) => ObjectionBuyerMapper.toEntity(d))
    );
  }

  public getBuyerById(id: string): Promise<Buyer> {
    return this.getBuyerModelById(id).then((data) =>
      ObjectionBuyerMapper.toEntity(data)
    );
  }

  public getNextId(): string {
    return uuidv4();
  }

  public async store(buyer: Buyer): Promise<Buyer> {
    const hasBuyer = await this.hasBuyer(buyer.id);
    if (hasBuyer) {
      const validationError = new InfrastructureError({
        title: "Validation Error",
        code: "VALIDATION_ERROR",
        message: `Buyer with id ${buyer.id} already exists.`
      });
      return Promise.reject(validationError);
    }
    return BuyerModel.query()
      .insertAndFetch(ObjectionBuyerMapper.toDatabase(buyer))
      .then((data) => ObjectionBuyerMapper.toEntity(data));
  }

  private getBuyerModelById(id: string): Promise<BuyerModel> {
    return BuyerModel.query()
      .findOne({
        uuid: id,
      })
      .then((data) => {
        if (data === undefined) {
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Buyer with id ${id} can't be found.`
          });
          return Promise.reject(notFoundError);
        }
        return data;
      });
  }

  private hasBuyer(id: string): Promise<boolean> {
    return BuyerModel.query()
    .findOne({
      uuid: id,
    })
    .then((data) => {
      if (data === undefined) {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    });
  }
}

export default ObjectionBuyerRepository;
