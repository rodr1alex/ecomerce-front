import { BaseProductImage } from "./base-product-image.model";
import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { ColorVariantProduct } from "./color-variant-product.model";
import { FinalProduct } from "./final-product.model";

export class BaseProduct{
    base_product_id: number = 0;
    name!: string;
    base_price!: number;
    chars!: string;
    specs!: string;
    brand!: Brand;
    baseProductImageList!: BaseProductImage[];
    colorVariantProductList!: ColorVariantProduct[];
    categoryList!: Category[];
}

 class BaseProductV2{
    //base_product_id: number = 0;
    name!: string;
    base_price!: number;
    chars!: string;
    specs!: string;
    //brand!: Brand;
    brand_id!: number
    //baseProductImageList!: BaseProductImage[];
    baseProductImagesURL!: String[];
    colorVariantProductList!: ColorVariantProductV2[];
    //categoryList!: Category[];
    categories_id!: number[];
}



 class ColorVariantProductV2{
    //color_variant_product_id: number = 0;
    //baseProduct!: BaseProduct;
    //color!: Color;
    color_id!: number
    colorVariantProductImagesURL!: String[];
    finalProductList!: FinalProductV2[];

}



 class FinalProductV2{
    //final_product_id: number = 0;
    stock!: number;
    final_price!: number;
    //img!: string;
    //name!: string;
    //brand!: string;
    //color!: string;
    //colorVariantProduct!: ColorVariantProduct;
    //size!: Size;
    size_id!: number
    //base_product_id!: number;
}