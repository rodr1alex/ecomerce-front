import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { BaseProduct } from '../../models/base-product.model';
import { putAll, setPaginator, find } from '../../store/base-product.action';
import { Size } from '../../models/size.model';
import { Color } from '../../models/color.model';
import { BaseProductImage } from '../../models/base-product-image.model';
import { ColorVariantProduct } from '../../models/color-variant-product.model';
import { firstValueFrom, of } from 'rxjs';
import { FinalProduct } from '../../models/final-product.model';
import { OrderedProduct } from '../../models/ordered-product.model';
import { Cart } from '../../models/cart.model';
import { addProduct, findProduct, updateCart } from '../../store/cart.action';
import { tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CartV2, ProductDetail, ProductInCart, SizesColors } from '../../models/products-general.model';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent implements OnInit {
  productDetail: ProductDetail = new ProductDetail()
  cart: CartV2 = new CartV2();
  orderedProduct!: OrderedProduct;
  quantity: number = 1;
  selectedSize: Size = new Size();
  selectedColor: Color = new Color();
  sizeList: Size[] = [];
  EnabledSizeList: Size[] = [];
  colorList: Color[] = [];
  ImageUrlList: string[] = []
  currentIndex = 0;

  touchStartX = 0;
  touchEndX = 0;
  isAuth: boolean = false;



  constructor(
    private cartStore: Store<{ carts: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
    this.cartStore.select('carts').subscribe(state => {
      this.cart = state.cart;
      //this.orderedProduct = state.orderedProduct;
    })
  }



  ngOnInit(): void {
    this.sharingDataService.showSearchBarEventEmitter.emit();
    this.isAuth = this.authService.user.isAuth;
    //this.getProductoDetail()
    // this.getColorList()
    // this.getSizeList()
    // this.getImageList()
    this.route.paramMap.subscribe(params => {
      const base_product_id = +(params.get('base_product_id') || '0');

      this.asyncGetProductoDetail(base_product_id)

      // @ts-ignore
      // this.baseProductStore.dispatch(find({ base_product_id: +(params.get('base_product_id')) }));
      // console.log('Esta wea rara de javaScript', this.baseProduct);
      // this.getImageList();
      // this.getColorList(this.baseProduct.colorVariantProductList);
      // this.sizeList = this.getSizeList(this.baseProduct.colorVariantProductList);
      // this.EnabledSizeList = this.sizeList;
    })

    setTimeout(() => {
      this.setColorButtons();
    }, 1)

    // if (this.colorList[0].color_id == 1) {
    //   this.selectedColor = this.colorList[0];
    // }

    // if (this.sizeList[0].size_id == 28) {
    //   this.selectedSize = this.sizeList[0];
    // }


    //setInterval(()=> console.log('mierda script: this.productDetail', this.productDetail), 3000)
  }

  async asyncGetProductoDetail(base_product_id: number) {
    try {
      const response = await firstValueFrom(this.baseProductService.findById(base_product_id))
      this.productDetail = response
      this.getColorList()
      this.getSizeList()
      this.getImageList()
    } catch (err) {
      console.error(err)
    }
  }

  getProductoDetail() {
    const productDetail = new ProductDetail();
    productDetail.baseProductId = 99
    productDetail.name = 'name test'
    productDetail.basePrice = 99
    productDetail.chars = 'char test'
    productDetail.specs = 'spect test'
    productDetail.brand = 'brand test'
    productDetail.imageList = [{ mobile: false, url: 'https://cl-dam-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/3840x0/filters:quality(75)/paris/609045/variant/images/baad55da-8a2c-4f24-a2a9-7722b2c2e2a0/609045-0400-002.jpg' }]
    productDetail.sizesColorsAvailable = [
      {
        finalProductId: 50,
        color: { color_id: 1, tailwindclass: 'ad', hexCodeColor: '#6DB33F', name: 'Verde' },
        size: { size_id: 1, name: 'S', finalProductList: [] }
      },
      {
        finalProductId: 51,
        color: { color_id: 1, tailwindclass: 'ad', hexCodeColor: '#6DB33F', name: 'Verde' },
        size: { size_id: 2, name: 'M', finalProductList: [] }
      },
      {
        finalProductId: 52,
        color: { color_id: 1, tailwindclass: 'ad', hexCodeColor: '#6DB33F', name: 'Verde' },
        size: { size_id: 3, name: 'L', finalProductList: [] }
      },
      {
        finalProductId: 70,
        color: { color_id: 2, tailwindclass: 'ad', hexCodeColor: '#3f45b3', name: 'Azul' },
        size: { size_id: 3, name: 'L', finalProductList: [] }
      },
      {
        finalProductId: 71,
        color: { color_id: 2, tailwindclass: 'ad', hexCodeColor: '#3f45b3', name: 'Azul' },
        size: { size_id: 4, name: 'XL', finalProductList: [] }
      }
    ]
    productDetail.colorsVariantInfo = [
      {
        color: { color_id: 1, tailwindclass: 'ad', hexCodeColor: '#6DB33F', name: 'Verde' },
        imageList: [
          { mobile: false, url: 'https://assets.adidas.com/images/c_fill,g_auto,w_1200,h_630,f_auto,q_auto/w_600,f_auto,q_auto/b0b6d4a107ad4e84b3baaf8700866f07_9366/Zapatillas_Campus_00s_Verde_H03472_01_standard.jpg' },
          { mobile: false, url: 'https://media.falabella.com/falabellaCL/80058744_01/w=800,h=800,fit=pad' },
        ]
      },
      {
        color: { color_id: 2, tailwindclass: 'ad', hexCodeColor: '#3f45b3', name: 'Azul' },
        imageList: [
          { mobile: false, url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/e896f4e921964dd6b668e534aa0b78b5_9366/Zapatillas_Break_Start_Azul_IH7967_01_standard.jpg' },
          { mobile: false, url: 'https://media.istockphoto.com/id/2208170004/es/foto/primer-plano-de-pies-con-zapatillas-adidas-spezial-azules-y-jeans-de-mezclilla-en-la-calle-de.jpg?s=612x612&w=0&k=20&c=NaL3E0FrJCLV-WpWRM7Ewgc8kWiIK3g0_M65NQFV-Bs=' },
        ]
      }

    ]


    this.productDetail = productDetail
  }



  setColorButtons() {
    for (let color of this.colorList) {
      let node = document.getElementById(color.name + '');
      node?.setAttribute('style', `background-color: ${color.hexCodeColor};`);
    }
  }

  getImageList() {
    this.ImageUrlList = [];
    this.ImageUrlList = this.productDetail.imageList.map(item => item.url)
  }

  getColorList() {
    const colorListAll = this.productDetail.sizesColorsAvailable.map(item => item.color);
    this.colorList = this.cleanRepeated(colorListAll, 'name')
  }

  getSizeList(): void {
    let sizeListAll: Size[] = this.productDetail.sizesColorsAvailable.map(item => item.size)
    this.sizeList = this.cleanRepeated(sizeListAll, 'name')
  }

  getEnabledSizeList(productDetail: ProductDetail, colorSelectedUI: Color): Size[] {
    const colors: SizesColors[] = productDetail.sizesColorsAvailable.filter(item => item.color.color_id == colorSelectedUI.color_id)
    return this.cleanRepeated(colors.map(item => item.size), 'name')
  }


  setSelectedSize(size: Size) {
    this.selectedSize = size;
    this.EnabledSizeList.map(sizeItem => {
      let node = document.getElementById(`${sizeItem.size_id}`);
      sizeItem.size_id === this.selectedSize.size_id ? node?.classList.add('button--selected') : node?.classList.remove('button--selected');
    })
  }

  setSelectedColor(colorSelectedUI: Color) {
    this.selectedColor = colorSelectedUI;
    this.ImageUrlList = this.productDetail.colorsVariantInfo.find(item => item.color.color_id == colorSelectedUI.color_id)?.imageList.map(item => item.url) || []
    this.currentIndex = 0;

    this.EnabledSizeList = this.getEnabledSizeList(this.productDetail, colorSelectedUI);
    this.sizeList.map(size => this.disableSizeButton(size));
    this.EnabledSizeList.map(size => this.enableSizeButton(size));

    let isContainded = false;
    this.EnabledSizeList.map(item => {
      if (item.size_id === this.selectedSize.size_id) {
        isContainded = true;
      }
    });
    if (!isContainded) {
      this.selectedSize = new Size();

    }
  }

  getFinalProductId(): number {
    const color_id_UI = this.selectedColor.color_id;
    const size_id_UI = this.selectedSize.size_id;
    return this.productDetail.sizesColorsAvailable.find(item => item.color.color_id == color_id_UI && item.size.size_id == size_id_UI)?.finalProductId || 0
  }


  addProductToCart() {
    let cartUpdated: any
    const productInCart: ProductInCart = new ProductInCart();
    productInCart.finalProductId = this.getFinalProductId()
    productInCart.brand = this.productDetail.brand
    productInCart.price = this.productDetail.basePrice
    productInCart.name = this.productDetail.name
    productInCart.color = this.selectedColor.name
    productInCart.size = this.selectedSize.name
    productInCart.img = { mobile: false, url: this.ImageUrlList[0] }
    productInCart.quantity = this.quantity
    cartUpdated = {
      ...this.cart,
      products: [...this.cart.products, productInCart]
    };

    cartUpdated.itemsNumber = 1
    cartUpdated.total = 9999

    this.cartStore.dispatch(addProduct({ product: productInCart }));

  }

  verifySizeAndColor() {
    if (this.sizeList.length > 0 && this.colorList.length > 0) {
      if (this.selectedSize.size_id && this.selectedColor.color_id) {
        this.addProductToCart();
      } else if (this.selectedSize.size_id == undefined && this.selectedColor.color_id == undefined) {
        alert('Debe seleccionar talla y color');
      } else if (this.selectedSize.size_id == undefined) {
        alert('Debe seleccionar talla')
      } else {
        alert('Debe seleccionar color')
      }
    } else if (this.sizeList.length > 0 && this.colorList.length == 0) {
      if (this.selectedSize.size_id) {
        this.addProductToCart();
      } else {
        alert('Debe seleccionar talla')
      }
    } else if (this.sizeList.length == 0 && this.colorList.length > 0) {
      if (this.selectedColor.color_id) {
        this.addProductToCart();
      } else {
        alert('Debe seleccionar color')
      }
    } else {
      this.addProductToCart();
    }
  }

  getBaseProductImageURL(baseProduct: BaseProduct): string[] {
    let urlList: string[] = [];
    for (let baseProductImage of baseProduct.baseProductImageList) {
      urlList.push(baseProductImage.url);
    }
    return urlList;
  }
  getColorVariantProductImageURL(colorVariantProduct: ColorVariantProduct): string[] {
    let urlList: string[] = [];
    for (let colorVariantProductImage of colorVariantProduct.colorVariantProductImageList) {
      urlList.push(colorVariantProductImage.url);
    }
    return urlList;
  }

  enableSizeButton(size: Size) {
    let node = document.getElementById(`${size.size_id}`);
    node?.removeAttribute('disabled');
    node?.classList.remove('button--disabled');
    if (size.size_id === this.selectedSize.size_id) {
      node?.classList.add('button--selected');
    }
  }

  disableSizeButton(size: Size) {
    let node = document.getElementById(`${size.size_id}`);
    node?.classList.add('button--disabled');
    node?.classList.remove('button--selected');
    node?.setAttribute('disabled', 'true');
  }

  decrease() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
  increase() {
    this.quantity++;
  }
  selectedImageIndex(i: number) {
    this.currentIndex = i;
  }
  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.ImageUrlList.length - 1 : this.currentIndex - 1;
  }
  next() {
    this.currentIndex = (this.currentIndex === this.ImageUrlList.length - 1) ? 0 : this.currentIndex + 1;
  }
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  handleSwipe() {
    if (this.touchEndX < this.touchStartX) {
      this.next();
    } else if (this.touchEndX > this.touchStartX) {
      this.prev();
    }
  }
  formatCurrency(value: number): string {
    if (value == undefined) {
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  cleanRepeated(originalList: any[], propertyToAvoid: string): any[] {
    return originalList.filter((item, index, self) =>
      index === self.findIndex((t) => t[propertyToAvoid] === item[propertyToAvoid])
    );
  }

}
