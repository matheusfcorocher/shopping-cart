type BuyerProps = {
  id: string;
  name: string;
  birthDate: Date;
  email: string;
  address: Address;
};

type Address = {
    postalCode: string;
    street: string;
    district: string;
    city: string;
    country: string;
}
export default class Buyer {
  id: string;
  name: string;
  birthDate: Date;
  email: string;
  address: Address;

  constructor({ id, name, birthDate, email, address }: BuyerProps) {
    this.id = id;
    this.name = name;
    this.birthDate = birthDate;
    this.email = email;
    this.address = address;
  }
}

export { Address };
