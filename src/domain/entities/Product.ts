type ProductProps = {
  id: number,
  name: string;
  price: number;
  available: number;
}
export default class Product {
  id: number;
  name: string;
  price: number;
  available: number;

  constructor({id, name, price, available} : ProductProps) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.available = available;
  }

  public isAvailable(): boolean {
    return this.available > 0;
  }
}
