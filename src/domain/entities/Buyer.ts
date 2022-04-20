type Address = {
  postalCode: string;
  street: string;
  district: string;
  city: string;
  country: string;
};

type Buyer = {
  id: string;
  name: string;
  birthDate: Date;
  email: string;
  address: Address;
};

//public functions
function createBuyer({ id, name, birthDate, email, address }: Buyer): Buyer {
  return { id, name, birthDate, email, address };
}

export { Address, Buyer };

export { createBuyer };
