import { LineItem } from "../entities/Cart";

interface Owner {
    ownerId: string;
    ownerType: string;
}

interface LineItemProps {
    unitPrice?: number;
    quantity?: number;
}

interface LineItemRepository {
  getAllLineItemsByOwner(owner: Owner): Promise<Array<LineItem>>;
  store(lineItem: LineItem, owner: Owner): Promise<LineItem>;
  update(owner: Owner, productId: string, data: LineItemProps): Promise<LineItem>;
  delete(owner: Owner, productId: string): Promise<String>;
  getNextId() : string;
}

export { LineItemRepository, Owner, LineItemProps };
