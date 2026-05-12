import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Size } from '../../models/general.model';
import { Color } from '../../models/general.model';
import { firstValueFrom } from 'rxjs';
import { addProduct } from '../../store/cart/cart.action';
import { FormsModule } from '@angular/forms';
import { Cart, ProductDetail, ProductInCart, SizesColors } from '../../models/general.model';
import { AlertService } from '../../services/alert.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent implements OnInit {
  productDetail: ProductDetail = new ProductDetail()
  cart: Cart = new Cart();
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
  isUniqueColor: boolean =false
  isUniqueSize: boolean = false

  constructor(
    private cartStore: Store<{ carts: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private alertService: AlertService,
    private toastService: ToastService) {
    this.cartStore.select('carts').subscribe(state => {
      this.cart = state.cart
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
    } catch (err: any) {
      if (err?.status === 404) {
        await this.router.navigate(['/not-found'])
        return
      }
      console.error(err)
    }
  }

  setColorList() {
    const colorListAll = this.productDetail.sizesColorsAvailable.map(item => item.color);
    const propertyToAvoid: string = 'name'
    this.colorList = this.cleanRepeated(colorListAll, propertyToAvoid)
    this.isUniqueColor = this.colorList[0].id == 1 // colorId == 1 indicates 'no color'
    if(this.isUniqueColor) this.selectedColor = this.colorList[0]
  }

  setSizeList(): void {
    let sizeListAll: Size[] = this.productDetail.sizesColorsAvailable.map(item => item.size)
    const propertyToAvoid: string = 'name'
    this.sizeList = this.cleanRepeated(sizeListAll, propertyToAvoid)
    this.enabledSizeList = this.sizeList
    this.isUniqueSize = this.sizeList[0].id == 28 // id == 28 indicates in only one size 'no size'
    if(this.isUniqueSize) this.selectedSize = this.sizeList[0]
  }

  setImageList() {
    this.imageUrlList = this.productDetail.imageList.map(item => item.url)
  }

  setColorButtons() {
    this.colorList.forEach(color => {
      const node = document.getElementById(color.name)
      if (node) node.style.backgroundColor = color.hexCodeColor
    })
  }

  //ui
  onSelectColor(selectedColorUI: Color) {
    this.selectedColor = selectedColorUI;
    this.imageUrlList = this.productDetail.colorsVariantInfo.find(item => item.color.id == selectedColorUI.id)?.imageList.map(item => item.url) || []
    this.currentImageIndex = 0;

    this.enabledSizeList = this.getEnabledSizeList(this.productDetail, selectedColorUI);
    this.sizeList.forEach(size => this.disableSizeButton(size));
    this.enabledSizeList.forEach(size => this.enableSizeButton(size));

    this.verifyActualSelectedSizeIsContainedInNewEnabledSizeList()

  }

  verifyActualSelectedSizeIsContainedInNewEnabledSizeList() {
    let isContained = false;
    this.enabledSizeList.forEach(enabledSize => {
      if (enabledSize.id === this.selectedSize.id) isContained = true
    });
    if (!isContained) this.selectedSize = new Size() // apply reset
  }

  setSelectedSize(size: Size) {
    this.selectedSize = size;
    this.enabledSizeList.forEach(enabledSize => {
      let node = document.getElementById(`${enabledSize.id}`);
      enabledSize.id === this.selectedSize.id ? node?.classList.add('button--selected') : node?.classList.remove('button--selected');
    })
  }

  getEnabledSizeList(productDetail: ProductDetail, colorSelectedUI: Color): Size[] {
    const colors: SizesColors[] = productDetail.sizesColorsAvailable.filter(item => item.color.id == colorSelectedUI.id)
    return this.cleanRepeated(colors.map(item => item.size), 'name')
  }

  onAddProductToCart() {
    if (!this.selectedSize.id && !this.selectedColor.id) {
      this.alertService.warning('Atencion', 'Debe seleccionar talla y color')
      return
    }
    if (!this.selectedSize.id) {
      this.alertService.warning('Atencion', 'Debe seleccionar talla')
      return
    }
    if (!this.selectedColor.id) {
      this.alertService.warning('Atencion', 'Debe seleccionar color')
      return
    }
    this.addProductToCart()
  }

  addProductToCart() {

    const productInCart: ProductInCart = new ProductInCart();
    productInCart.baseProductId = this.productDetail.baseProductId
    productInCart.finalProductId = this.getFinalProductId()
    productInCart.brand = this.productDetail.brand
    productInCart.price = this.productDetail.basePrice
    productInCart.name = this.productDetail.name
    productInCart.color = this.selectedColor.name
    productInCart.size = this.selectedSize.name
    productInCart.img = { mobile: false, url: this.imageUrlList[0] }
    productInCart.quantity = this.quantity
  

    this.cartStore.dispatch(addProduct({ product: productInCart }));
    this.toastService.success('Producto agregado al carrito', 1800);

  }

  getFinalProductId(): number {
    const colorIdUI = this.selectedColor.id;
    const idUI = this.selectedSize.id;
    return this.productDetail.sizesColorsAvailable.find(item => item.color.id == colorIdUI && item.size.id == idUI)?.finalProductId || 0
  }


  enableSizeButton(size: Size) {
    let node = document.getElementById(`${size.id}`);
    node?.removeAttribute('disabled');
    node?.classList.remove('button--disabled');
    if (size.id === this.selectedSize.id) {
      node?.classList.add('button--selected');
    }
  }

  disableSizeButton(size: Size) {
    let node = document.getElementById(`${size.id}`);

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
