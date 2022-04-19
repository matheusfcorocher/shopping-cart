import * as Buyer from "../../../domain/entities/Buyer";
import { Address } from "../../../domain/entities/Buyer";
import { BuyerModel } from "../../database/knex/models/BuyerModel";

const ObjectionBuyerMapper = {
  toEntity(dataValues: BuyerModel) {
    const {
      uuid,
      name,
      birthDate,
      email,
      postalCode,
      street,
      district,
      city,
      country,
    } = dataValues;

    const address: Address = {
      postalCode,
      street,
      district,
      city,
      country,
    };

    return Buyer.createBuyer({
      id: uuid,
      name,
      birthDate,
      email,
      address,
    });
  },
  toDatabase(buyer: Buyer.Buyer) {
    const { id, name, birthDate, email, address } = buyer;
    const { postalCode, street, district, city, country } = address;
    return {
      uuid: id,
      name,
      birthDate,
      email,
      postalCode,
      street,
      district,
      city,
      country,
    };
  },
};

export { ObjectionBuyerMapper };
