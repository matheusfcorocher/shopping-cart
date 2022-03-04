import { v4 as uuidv4 } from 'uuid';
import { Buyer } from "../../../src/domain/entities";
import { BuyerRepository } from "../../../src/domain/repositories/BuyerRepository";

class FakeBuyerRepository implements BuyerRepository {
  buyers: Array<Buyer>;

  constructor(buyers: Array<Buyer>) {
    this.buyers = buyers;
  }

  public getAllBuyers(): Promise<Buyer[]> {
    return Promise.resolve(this.buyers);
  }
  
  public getNextId(): string {
    return uuidv4();
  }

  public store(buyer: Buyer): Promise<string> {
    this.buyers.push(buyer);
    return Promise.resolve("Buyer was emitted sucessfully!")
  }
}

export { FakeBuyerRepository };
