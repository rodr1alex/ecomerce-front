import { BaseProduct } from "./base-product.model";

export class BaseProductImage{
    base_product_image_id!: number ;
    url!: string;
    baseProduct!: BaseProduct;
}