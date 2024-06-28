import { BaseProduct } from "./base-product.model";

export class Category{
    category_id: number = 0;
    name!: String;
    baseProductList!: BaseProduct[];
}