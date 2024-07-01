import { Cart } from "./cart.model";
import { FinalProduct } from "./final-product.model";

export class OrderedProduct{
    ordered_product_id!: number;
    quantity!: number;
    cart!: Cart;
    finalProduct!: FinalProduct;
}