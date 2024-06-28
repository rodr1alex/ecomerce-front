import { BaseProduct } from "./base-product.model";
import { ColorVariantProductImage } from "./color-variant-product-image.model";
import { Color } from "./color.model";
import { FinalProduct } from "./final-product.model";

export class ColorVariantProduct{
    color_variant_product_id: number = 0;
    baseProduct!: BaseProduct;
    color!: Color;
    colorVariantProductImageList!: ColorVariantProductImage[];
    finalProductList!: FinalProduct[];

}