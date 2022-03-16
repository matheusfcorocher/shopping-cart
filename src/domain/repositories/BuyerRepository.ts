import Buyer from "../entities/Buyer";

interface BuyerRepository {
  getAllBuyers(): Promise<Array<Buyer>>;
  store(buyer: Buyer): Promise<Buyer>;
  getNextId() : string;
}

export { BuyerRepository };
