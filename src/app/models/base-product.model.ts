import { BaseProductImage } from "./base-product-image.model";
import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { ColorVariantProduct } from "./color-variant-product.model";

export class BaseProduct{
    base_product_id: number = 0;
    name!: string;
    base_price!: number;
    description!: string;
    chars!: string;
    specs!: string;
    brand!: Brand;
    baseProductImageList!: BaseProductImage[];
    colorVariantProductList!: ColorVariantProduct[];
    categoryList!: Category[];
}