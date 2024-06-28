import { BaseProductImage } from "./base-product-image.model";
import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { ColorVariantProduct } from "./color-variant-product.model";

export class BaseProduct{
    base_product_id: number = 0;
    name!: String;
    base_price!: number;
    description!: String;
    chars!: String;
    specs!: String;
    brand!: Brand;
    baseProductImageList!: BaseProductImage[];
    colorVariantProductList!: ColorVariantProduct[];
    categoryList!: Category[];
}