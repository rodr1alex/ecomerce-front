import { BaseProduct } from "./base-product.model";

export class BaseProductImage{
    base_product_image_id: number = 0;
    url!: String;
    baseProduct!: BaseProduct;
}