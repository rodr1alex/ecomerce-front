import { BaseProduct } from "./base-product.model";

export class Category{
    category_id: number = 0;
    name!: string;
    baseProductList!: BaseProduct[];

    constructor(category_id: number, name: string){
        this.category_id = category_id;
        this.name = name;
    }
}