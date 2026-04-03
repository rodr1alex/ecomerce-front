import { Color } from "./color.model";
import { Size } from "./size.model";



export class ProductBasicInfo {
    baseProductId: number = 0;
    name: string = '';
    basePrice: number = 0;
    brand: string = '';
    imageList: GenericImage[] = [];
}

export class ProductDetail {
    baseProductId: number = 0;
    name: string = '';
    basePrice: number = 0;
    brand: string = '';
    chars: string = '';
    specs: string = '';
    imageList: GenericImage[] = [];
    sizesColorsAvailable: SizesColors[] = [];
    colorsVariantInfo: ColorsVariantInfo[] = [];
}


export class GenericImage {
    url: string = '';
    mobile: boolean = false;
}

export class SizesColors {
    finalProductId: number = 0;
    size: Size =  new Size(); // Or your Size object/enum
    color: Color = new Color() 
}

export class ColorsVariantInfo {
    color: Color = new Color() 
    imageList: GenericImage[] = [];
}

export class ProductInCart {
    id: number = 0;
    finalProductId: number = 0;
    baseProductId: number = 0;
    quantity: number = 0;
    img: GenericImage = new GenericImage(); // Ensures nested object isn't undefined
    brand: string = '';
    name: string = '';
    size: string = '';
    price: number = 0;
    color: string = '';
}

export class CartV2 {
    cart_id: number = 0;
    total: number = 0;
    itemsNumber: number = 0;
    products: ProductInCart[] = [];
}