import { ColorVariantProduct } from "./color-variant-product.model";
import { OrderedProduct } from "./ordered-product.model";
import { Size } from "./size.model";

export class FinalProduct{
    final_product_id: number = 0;
    stock!: number;
    final_price!: number;
    img!: string;
    name!: string;
    brand!: string;
    color!: string;
    colorVariantProduct!: ColorVariantProduct;
    size!: Size;
    base_product_id!: number;
    orderedProductList!: OrderedProduct[];
}