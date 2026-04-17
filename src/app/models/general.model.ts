export class Brand{
    brand_id: number = 0;
    name!: String
}

export class Color{
    color_id!: number;
    name!: string;
    tailwindclass!: string;
    hex_code_color!: string;
}

export class Size{
    size_id!: number;
    name!: string;
}

export class Category{
    category_id: number = 0;
    name!: string;

    constructor(category_id: number, name: string){
        this.category_id = category_id;
        this.name = name;
    }
}


export class CategoryList{
    categoryName!: Category;
    subCategoryList!: Category[];
}

export class Direction{
    direction_id: number = 0;
    city!: String;
    street!: String;
    number!: String;
    user_id!: number;
}





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

export class Cart {
    cart_id: number = 0;
    total: number = 0;
    itemsNumber: number = 0;
    products: ProductInCart[] = [];
}

export class CartForPayment{
    user_id: number = 0;
    direction_id: number = 0;
    products: OrderedProductDTO[] = []
}

export class OrderedProductDTO{
    quantity: number = 0;
    final_product_id: number = 0;

    constructor( quantity: number, final_product_id: number,){
        this.quantity = quantity
        this.final_product_id = final_product_id
    }
}


export class UserFilter{
    page_size: number = 0
    page: number = 0
    admin: boolean | undefined = false
}

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

export class Sale{
    sale_id!: number;
    date!: any;
    direction!: Direction;
    saleStatus!: SaleStatus
    total!: number
    items!: number
    user!: User
}

export class SaleDetail{
    sale_id!: number;
    date!: any;
    direction!: Direction;
    saleStatus: SaleStatus = new SaleStatus()
    total!: number
    items!: number
    user!: User
    products!: OrderedProductDetail[]
}

export class OrderedProductDetail{
    ordered_product_id!: number
    final_product_id!: number
    base_product_id!: number
    quantity!: number
    originalQuantity!: number
    imgUrl!: string
    brand!: string
    productName!: string
    color!: string
    size!: string
    priceAtPurchase!: number
}


export class SaleStatus {
  status_id!: number;
  name!: string;
  description!: string;
}

export class SaleFilter {
  user_id: number | null;
  startTotal: number | null;
  endTotal: number | null;
  sale_status_id: number | null;
  page: number;
  pageSize: number;

  constructor() {
    this.user_id = null;
    this.startTotal = null;
    this.endTotal = null;
    this.sale_status_id = null;
    this.page = 0;
    this.pageSize = 10;
  }

  /**
   * Limpia los criterios de búsqueda pero mantiene la paginación base
   */
  clearFilters(): void {
    this.user_id = null;
    this.startTotal = null;
    this.endTotal = null;
    this.sale_status_id = null;
  }
}


export class ProductReturned {
  final_product_id!: number
  ordered_product_id!: number
  quantityToReturn!: number
}


export class FinalProductDTO {
  final_product_id: number;
  final_price: number;
  color: string;
  size: string;
  brand: string;
  name: string;

  constructor(data?: Partial<FinalProductDTO>) {
    this.final_product_id = data?.final_product_id || 0;
    this.final_price = data?.final_price || 0;
    this.color = data?.color || '';
    this.size = data?.size || '';
    this.brand = data?.brand || '';
    this.name = data?.name || '';
  }
}

export class AdminFinalProductDTO extends FinalProductDTO {
  stock: number = 0;
  base_product_id!: number
}

export class FilterAdminProduct {
  brand_id: number | null = null;
  color_id: number | null = null;
  size_id: number | null = null;
  page: number = 0;
  pageSize: number = 10;
  categories: number[] = [];

  reset(): void {
    this.brand_id = null;
    this.color_id = null;
    this.size_id = null;
    this.categories = [];
  }
}


export class BannerImage{
    banner_image_id!: number;
    url!: string;
    mobile!: boolean;

    constructor(url: string){
        this.url = url;
    }
}


export class User {
    id: number = 0;
    name!: string;
    lastname!: string;
    email!: string;
    username!: string;
    password!: string;
    directionList!: Direction[];
    admin!: boolean
}

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