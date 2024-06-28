import { ColorVariantProduct } from "./color-variant-product.model";
import { Size } from "./size.model";

export class FinalProduct{
    final_product_id: number = 0;
    stock!: number;
    final_price!: number;
    final_description!: String;
    final_chars!: String;
    final_specs!: String;
    colorVariantProduct!: ColorVariantProduct;
    size!: Size;
    //orderedProductList!: OrderedProduct[];
}