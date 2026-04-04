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
  enabledSizeList: Size[] = [];
  colorList: Color[] = [];
  imageUrlList: string[] = []
  currentImageIndex = 0;

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




  async ngOnInit(): Promise<void> {
    this.sharingDataService.showSearchBarEventEmitter.emit()
    this.isAuth = this.authService.user.isAuth

    this.route.paramMap.subscribe(async params => {
      const base_product_id = +(params.get('base_product_id') || '0')
      await this.getProductoDetail(base_product_id)
      this.setColorList()
      this.setSizeList()
      this.setImageList()
      setTimeout(() => this.setColorButtons(), 1)
    })

  }

  async getProductoDetail(base_product_id: number) {
    try {
      const response = await firstValueFrom(this.baseProductService.findById(base_product_id))
      this.productDetail = response
    } catch (err) {
      console.error(err)
    }
  }

  setColorList() {
    const colorListAll = this.productDetail.sizesColorsAvailable.map(item => item.color);
    const propertyToAvoid: string = 'name'
    this.colorList = this.cleanRepeated(colorListAll, propertyToAvoid)
  }

  setSizeList(): void {
    let sizeListAll: Size[] = this.productDetail.sizesColorsAvailable.map(item => item.size)
    const propertyToAvoid: string = 'name'
    this.sizeList = this.cleanRepeated(sizeListAll, propertyToAvoid)
    this.enabledSizeList = this.sizeList
  }

  setImageList() {
    this.imageUrlList = this.productDetail.imageList.map(item => item.url)
  }

  setColorButtons() {
    this.colorList.forEach(color => {
      const node = document.getElementById(color.name)
      if (node) node.style.backgroundColor = color.hex_code_color
    })
  }

  //ui
  onSelectColor(selectedColorUI: Color) {
    this.selectedColor = selectedColorUI;
    this.imageUrlList = this.productDetail.colorsVariantInfo.find(item => item.color.color_id == selectedColorUI.color_id)?.imageList.map(item => item.url) || []
    this.currentImageIndex = 0;

    this.enabledSizeList = this.getEnabledSizeList(this.productDetail, selectedColorUI);
    this.sizeList.forEach(size => this.disableSizeButton(size));
    this.enabledSizeList.forEach(size => this.enableSizeButton(size));

    this.verifyActualSelectedSizeIsContainedInNewEnabledSizeList()

  }


  verifyActualSelectedSizeIsContainedInNewEnabledSizeList() {
    let isContained = false;
    this.enabledSizeList.forEach(enabledSize => {
      if (enabledSize.size_id === this.selectedSize.size_id) isContained = true
    });
    if (!isContained) this.resetSelectedSize()
  }

  resetSelectedSize() {
    this.selectedSize = new Size()
  }

  setSelectedSize(size: Size) {
    this.selectedSize = size;
    this.enabledSizeList.forEach(enabledSize => {
      let node = document.getElementById(`${enabledSize.size_id}`);
      enabledSize.size_id === this.selectedSize.size_id ? node?.classList.add('button--selected') : node?.classList.remove('button--selected');
    })
  }

  getEnabledSizeList(productDetail: ProductDetail, colorSelectedUI: Color): Size[] {
    const colors: SizesColors[] = productDetail.sizesColorsAvailable.filter(item => item.color.color_id == colorSelectedUI.color_id)
    return this.cleanRepeated(colors.map(item => item.size), 'name')
  }

  onAddProductToCart() {
    if (this.existProblemSize() && this.existProblemColor()) return alert('Debe seleccionar talla y color')
    if (this.existProblemSize()) return alert('Debe seleccionar talla')
    if (this.existProblemColor()) return alert('Debe seleccionar color')
    this.addProductToCart()
  }

  existProblemSize(): boolean {
    return this.sizeList.length > 0 && !this.selectedSize.size_id
  }

  existProblemColor(): boolean {
    return this.colorList.length > 0 && !this.selectedColor.color_id
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
    productInCart.img = { mobile: false, url: this.imageUrlList[0] }
    productInCart.quantity = this.quantity
    cartUpdated = {
      ...this.cart,
      products: [...this.cart.products, productInCart]
    };

    cartUpdated.itemsNumber = 1
    cartUpdated.total = 9999

    this.cartStore.dispatch(addProduct({ product: productInCart }));

  }

  getFinalProductId(): number {
    const color_id_UI = this.selectedColor.color_id;
    const size_id_UI = this.selectedSize.size_id;
    return this.productDetail.sizesColorsAvailable.find(item => item.color.color_id == color_id_UI && item.size.size_id == size_id_UI)?.finalProductId || 0
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
    if (this.quantity === 0) return
    this.quantity--
  }

  increase() {
    this.quantity++
  }

  selectedImageIndex(i: number) {
    this.currentImageIndex = i;
  }

  prev() {
    this.currentImageIndex = (this.currentImageIndex === 0) ? this.imageUrlList.length - 1 : this.currentImageIndex - 1;
  }

  next() {
    this.currentImageIndex = (this.currentImageIndex === this.imageUrlList.length - 1) ? 0 : this.currentImageIndex + 1;
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
    if (value == undefined) value = 0
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  cleanRepeated(originalList: any[], propertyToAvoid: string): any[] {
    return originalList.filter((item, index, self) =>
      index === self.findIndex((t) => t[propertyToAvoid] === item[propertyToAvoid])
    );
  }

}
