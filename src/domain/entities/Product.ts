export default class Product {
  id: number;
  name: string;
  price: number;
  available: number;

  constructor(id: number, name: string, price: number, available: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.available = available;
  }

  public isAvailable(): boolean {
    return this.available > 0;
  }
}
