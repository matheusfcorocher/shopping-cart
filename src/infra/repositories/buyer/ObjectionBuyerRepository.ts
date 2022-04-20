import { v4 as uuidv4 } from "uuid";
import * as Buyer from "../../../domain/entities/Buyer";
import { BuyerRepository } from "../../../domain/repositories/BuyerRepository";
import { InfrastructureError } from "../../../lib/CustomError";
import { BuyerModel } from "../../database/knex/models/BuyerModel";
import { ObjectionBuyerMapper } from "./ObjectionBuyerMapper";

const ObjectionBuyerRepository: BuyerRepository = {
  getAllBuyers: function (): Promise<Buyer.Buyer[]> {
    return BuyerModel.query().then((data) =>
      data.map((d) => ObjectionBuyerMapper.toEntity(d))
    );
  },
  getBuyerById: function(id: string): Promise<Buyer.Buyer> {
    return getBuyerModelById(id).then((data) =>
      ObjectionBuyerMapper.toEntity(data)
    );
  },
  store: async function (buyer: Buyer.Buyer): Promise<Buyer.Buyer> {
    const hasBuyer2 = await hasBuyer(buyer.id);
    if (hasBuyer2) {
      const validationError = new InfrastructureError({
        title: "Validation Error",
        code: "VALIDATION_ERROR",
        message: `Buyer with id ${buyer.id} already exists.`,
      });
      return Promise.reject(validationError);
    }
    return BuyerModel.query()
      .insertAndFetch(ObjectionBuyerMapper.toDatabase(buyer))
      .then((data) => ObjectionBuyerMapper.toEntity(data));
  },
  getNextId: function (): string {
    return uuidv4();
  },
};

function getBuyerModelById(id: string): Promise<BuyerModel> {
  return BuyerModel.query()
    .findOne({
      uuid: id,
    })
    .then((data) => {
      if (data === undefined) {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Buyer with id ${id} can't be found.`,
        });
        return Promise.reject(notFoundError);
      }
      return data;
    });
}

function hasBuyer(id: string): Promise<boolean> {
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

export default ObjectionBuyerRepository;
