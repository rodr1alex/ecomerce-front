

export class CreateBaseProduct{
    name!: string;
    base_price!: number;
    chars!: string;
    specs!: string;
    brand_id!: number
    baseProductImagesURL!: String[];
    colorVariantProductList!: CreateColorVariantProduct[];
    categories_id!: number[];
}


export class CreateColorVariantProduct{
    color_id!: number
    colorVariantProductImagesURL!: String[];
    finalProductList!: CreateFinalProduct[];
}



export class CreateFinalProduct{
    stock!: number;
    final_price!: number;
    size_id!: number
}