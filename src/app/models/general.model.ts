// PRODUCTS //

export class BasicProductInfo {
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
    colorsVariantInfo: ColorVariantInfo[] = [];
}


export class AdminFinalProduct {
    finalProductId!: number;
    baseProductId!: number;
    finalPrice!: number;
    color!: string;
    size!: string;
    brand!: string;
    name!: string;
    stock: number = 0;
}


export class FilterAdminProduct {
    brandId: number | null = null;
    colorId: number | null = null;
    sizeId: number | null = null;
    page: number = 0;
    pageSize: number = 10;
    categories: number[] = [];

    reset(): void {
        this.brandId = null;
        this.colorId = null;
        this.sizeId = null;
        this.categories = [];
    }
}

// llamado -> CreateBaseProductDTO en api
export class AdminBaseProduct { 
    name!: string;
    basePrice!: number;
    chars!: string;
    specs!: string;
    brandId!: number;
    baseProductImagesURL!: string[];
    colorVariantProductList!: CreateColorVariantProduct[];
    categoriesId!: number[];
}

export class CreateColorVariantProduct {
    colorId!: number;
    colorVariantProductImagesURL!: string[];
    finalProductList!: CreateFinalProduct[];
}

export class CreateFinalProduct {
    stock!: number;
    finalPrice!: number;
    sizeId!: number;
}

export class GenericImage {
    url: string = '';
    mobile: boolean = false;
}

export class SizesColors {
    finalProductId: number = 0;
    size: Size = new Size(); // Or your Size object/enum
    color: Color = new Color()
}

export class ColorVariantInfo {
    color: Color = new Color()
    imageList: GenericImage[] = [];
}


//BASICS //

export class Brand {
    id: number = 0;
    name!: string;
}

export class Color {
    id!: number;
    name!: string;
    tailwindclass!: string;
    hexCodeColor!: string;
}

export class Size {
    id!: number;
    name!: string;
}

export class Category {
    categoryId: number = 0;
    name!: string;

    constructor(categoryId: number, name: string) {
        this.categoryId = categoryId;
        this.name = name;
    }
}

export class CategoryList {
    categoryName!: Category;
    subCategoryList!: Category[];
}

export class Direction {
    directionId: number = 0;
    city!: string;
    street!: string;
    number!: string;
    //userId!: number;
}

export class BannerImage {
    id!: number;
    url!: string;
    mobile!: boolean;

    constructor(url: string) {
        this.url = url;
    }
}









// CART //

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

export class Cart {
    cartId: number = 0;
    total: number = 0;
    itemsNumber: number = 0;
    products: ProductInCart[] = [];
}

export class CartForPayment {
    userId: number = 0;
    directionId: number = 0;
    products: OrderedProduct[] = [];
}

export class OrderedProduct {
    quantity: number = 0;
    finalProductId: number = 0;

    constructor(quantity: number, finalProductId: number) {
        this.quantity = quantity;
        this.finalProductId = finalProductId;
    }
}




// SALE //

export class AdminSaleBasicInfo {
    saleId!: number;
    date!: any;
    total!: number;
    items!: number;
    user!: User;
    saleStatus!: SaleStatus;
}

export class AdminSaleDetail {
    saleId!: number;
    date!: any;
    direction!: Direction;
    saleStatus: SaleStatus = new SaleStatus();
    total!: number;
    items!: number;
    user!: User;
    products!: OrderedProductDetail[];
}

export class OrderedProductDetail {
    orderedProductId!: number;
    finalProductId!: number;
    baseProductId!: number;
    quantity!: number;
    originalQuantity!: number;
    imgUrl!: string;
    brand!: string;
    productName!: string;
    color!: string;
    size!: string;
    priceAtPurchase!: number;
}


export class SaleStatus {
    statusId!: number;
    name!: string;
    description!: string;
}

export class SaleFilter {
    userId: number | null;
    startTotal: number | null;
    endTotal: number | null;
    saleStatusId: number | null;
    page: number;
    pageSize: number;
    startDate: Date | null;
    endDate: Date | null;

    constructor() {
        this.userId = null;
        this.startTotal = null;
        this.endTotal = null;
        this.saleStatusId = null;
        this.page = 0;
        this.pageSize = 10;
        this.startDate = null;
        this.endDate = null;
    }

    clearFilters(): void {
        this.userId = null;
        this.startTotal = null;
        this.endTotal = null;
        this.saleStatusId = null;
        this.startDate = null;
        this.endDate = null;
    }
}

export class BasicProductFilter {
    brandId: number | null;
    categoriesIds: number[] | null;
    page: number;
    pageSize: number;

    constructor() {
        this.brandId = null;
        this.categoriesIds = null;
        this.page = 0;
        this.pageSize = 2;
    }

    clearFilters(): void {
        this.brandId = null;
        this.categoriesIds = null;
    }
}


export class ProductReturned {
    finalProductId!: number;
    //orderedProductId!: number;
    quantityToReturn!: number;
}







// USER //

export class UserFilter {
    pageSize: number = 0;
    page: number = 0;
    admin: boolean | null = false;

    constructor() {
        this.admin = null;
        this.page = 0;
        this.pageSize = 10;
    }

    clearFilters(): void {
        this.admin = null;
    }

}

export class User {
    id: number = 0;
    name!: string;
    lastname!: string;
    email!: string;
    username!: string;
    password!: string; //use with caution, consider security implications
    directionList!: Direction[];
    admin!: boolean
}


// GENERICS //
export class Page<T> {
    content: T[];
    pageable: {
        sort: { empty: boolean; sorted: boolean; unsorted: boolean };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    constructor() {
        this.content = [];
        this.pageable = {
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            pageNumber: 0,
            pageSize: 0,
            paged: true,
            unpaged: false
        };
        this.last = true;
        this.totalElements = 0;
        this.totalPages = 0;
        this.size = 0;
        this.number = 0;
        this.sort = { empty: true, sorted: false, unsorted: true };
        this.first = true;
        this.numberOfElements = 0;
        this.empty = true;
    }
}