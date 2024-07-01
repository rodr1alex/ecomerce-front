import { OrderedProduct } from "./ordered-product.model";
import { Sale } from "./sale.model";
import { User } from "./user.model";

export class Cart{
    cart_id: number = 0;
    total!: number;
    items!: number;
    user!: User;
    sale!: Sale;
    orderedProductList!: OrderedProduct[];
}