import { ColorVariantProduct } from "./color-variant-product.model";
import { Size } from "./size.model";

export class FinalProduct{
    final_product_id: number = 0;
    stock!: number;
    final_price!: number;
    final_description!: string;
    final_chars!: string;
    final_specs!: string;
    brand!: string;
    color!: string;
    img!: string;
    colorVariantProduct!: ColorVariantProduct;
    size!: Size;
    base_product_id!: number;
    name!: string;
    //orderedProductList!: OrderedProduct[];
}