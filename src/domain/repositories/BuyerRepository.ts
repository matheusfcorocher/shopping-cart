import Buyer from "../entities/Buyer";

interface BuyerRepository {
  getAllBuyers(): Promise<Array<Buyer>>;
  createBuyer(order: Buyer): Promise<string>;
  getNextId() : string;
}

export { BuyerRepository };
