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
import { of } from 'rxjs';
import { FinalProduct } from '../../models/final-product.model';
import { OrderedProduct } from '../../models/ordered-product.model';
import { Cart } from '../../models/cart.model';
import { findProduct } from '../../store/cart.action';
import { tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent implements OnInit{
  baseProduct!: BaseProduct;
  baseProductList!: BaseProduct[];
  cart: Cart = new Cart();
  orderedProduct!: OrderedProduct;
  quantity: number = 1;
  selectedSize: Size = new Size();
  selectedColor: Color = new Color();
  sizeList: Size[] = [];
  sizeListEnabled: Size[] = [];
  colorList: Color[] = [];
  imageListURL: string[] = []
  currentIndex = 0;
  touchStartX = 0;
  touchEndX = 0;
  
  

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private cartStore: Store<{carts:any}>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.baseProduct = state.baseProduct;
        this.baseProductList = state.baseProductList;
        
      });
      this.cartStore.select('carts').subscribe(state =>{
        this.cart = state.cart;
        this.orderedProduct = state.orderedProduct;
      })
    
  }
 
  get login() {
    return this.authService.user;
  }

  ngOnInit(): void {
    this.sharingDataService.showSearchBarEventEmitter.emit();
    this.route.paramMap.subscribe(params => {
      const base_product_id = +(params.get('base_product_id') || '0');
      this.baseProductStore.dispatch(find({base_product_id}));
      this.getImageList();
      this.getColorList(this.baseProduct.colorVariantProductList);
      this.sizeList = this.getSizeList(this.baseProduct.colorVariantProductList);
      this.sizeListEnabled = this.sizeList;
    })
    
    setTimeout(()=>{
      this.setColorButtons();
    },100)
   
  }

  formatCurrency(value: number): string {
    if(value == undefined){
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  setColorButtons(){
    for(let color of this.colorList){
      let node = document.getElementById(color.name + '');
      console.log('Nodos obtenidos',node);
      node?.classList.add(color.tailwindclass);
    }
  }
  getImageList(){
    this.imageListURL = [];
    this.imageListURL = this.getImageURLBaseProduct(this.baseProduct);
  }
  getColorList(colorVariantProductList: ColorVariantProduct[]){
    this.colorList = [];
    colorVariantProductList.map(colorVariantProduct => this.colorList.push(colorVariantProduct.color));
  }
  getSizeList(colorVariantProductList: ColorVariantProduct[]): Size[]{
    let sizeList: Size[] = [];
    colorVariantProductList.map(colorVariantProduct => colorVariantProduct.finalProductList.map(finalProduct => sizeList.push(finalProduct.size)));
    const sizeListClean: Size[] = [];
    const indexList: number[] = [];
    sizeList.map(size => {
      if(indexList.indexOf(size.size_id) === -1){
        indexList.push(size.size_id);
        sizeListClean.push(size);
      }
    })
    sizeListClean.sort((a,b) => a.size_id - b.size_id); //microoptimizacion recomendada
    return sizeListClean;
  }
  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.imageListURL.length - 1 : this.currentIndex - 1;
  }
  next() {
    this.currentIndex = (this.currentIndex === this.imageListURL.length - 1) ? 0 : this.currentIndex + 1;
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
  decrease(){
    if(this.quantity > 0){
      this.quantity --;
    }
  }
  increase(){
    this.quantity ++;
  }
  setSelectedSize(size: Size){
    this.selectedSize = size;
    this.sizeListEnabled.map(sizeItem => {
      let node = document.getElementById(`${sizeItem.size_id}`);
      sizeItem.size_id === this.selectedSize.size_id ? node?.classList.add('button--selected'): node?.classList.remove('button--selected');
    })
    
    
  }
  selectedImageIndex(i: number){
    this.currentIndex = i;
  }
  setSelectedColor(colorName: Color){
    this.selectedColor = colorName;
    const colorVariantProductList: ColorVariantProduct[] = this.baseProduct.colorVariantProductList.filter(item =>item.color.color_id == this.selectedColor.color_id);
    this.imageListURL = [];
    this.imageListURL = [...this.getImageURLColorVariantProduct(colorVariantProductList[0]), ...this.getImageURLBaseProduct(this.baseProduct)];
    this.currentIndex = 0;

    this.sizeListEnabled = this.getSizeList(colorVariantProductList);
    this.sizeList.map(size => this.disableSizeButton(size));
    this.sizeListEnabled.map(size => this.enableSizeButton(size));

    let isContainded = false;
    this.sizeListEnabled.map(item => {
        if(item.size_id === this.selectedSize.size_id){
          isContainded = true;
        }
    });
    if(!isContainded){
      this.selectedSize = new Size();
      
    }
  }
  getFinalProduct(): FinalProduct{
    const color_id = this.selectedColor.color_id;
    const size_id = this.selectedSize.size_id;
    console.log(`Se filtrara por color_id: ${color_id}, y por size_id: ${size_id}`);
    return (this.baseProduct.colorVariantProductList.filter(colorVariantProduct => colorVariantProduct.color.color_id === color_id)[0].finalProductList.filter(finalProduct => finalProduct.size.size_id === size_id)[0]);
  }

  
  addProductToCart(){
    console.log('este el componenete que esta weando')
    let productInCart = false;
    const orderedProduct = new OrderedProduct();
    orderedProduct.quantity = this.quantity;
    orderedProduct.finalProduct = this.getFinalProduct(); 
    if(this.cart.orderedProductList != null){
      this.cart.orderedProductList.map(orderedProductCART => {
        if(orderedProductCART.finalProduct.final_product_id == orderedProduct.finalProduct.final_product_id){
          console.log('Producto ya esta en carrito, final_product_id: ', orderedProductCART.finalProduct.final_product_id);
          this.cartStore.dispatch(findProduct({final_product_id:orderedProductCART.finalProduct.final_product_id}))
          this.sharingDataService.modifyProductQuantityCartEventEmitter.emit({diferential: this.quantity, orderedProduct: this.orderedProduct});
          productInCart = true;
        }
      })
    if(productInCart == false){
        this.sharingDataService.addProductToCartEventEmitter.emit(orderedProduct);
    }
    }else{
      this.sharingDataService.addProductToCartEventEmitter.emit(orderedProduct);
    }
  }

  verifySizeAndColor(){
    if(this.sizeList.length > 0  && this.colorList.length > 0){
      if(this.selectedSize.size_id && this.selectedColor.color_id){
        this.addProductToCart();
      }else if(this.selectedSize.size_id == undefined && this.selectedColor.color_id == undefined){
        alert('Debe seleccionar talla y color');
      }else if(this.selectedSize.size_id == undefined ){
        alert('Debe seleccionar talla')
      }else{
        alert('Debe seleccionar color')
      }
    }else if(this.sizeList.length > 0  && this.colorList.length == 0){
      if(this.selectedSize.size_id){
        this.addProductToCart();
      }else{
        alert('Debe seleccionar talla')
      }
    }else if(this.sizeList.length == 0  && this.colorList.length > 0){
      if(this.selectedColor.color_id){
        this.addProductToCart();
      }else{
        alert('Debe seleccionar color')
      }
    }else{
      this.addProductToCart();
    }
  }

  getImageURLBaseProduct(baseProduct: BaseProduct): string[]{
    let urlList: string[] = [];
    for(let baseProductImage of baseProduct.baseProductImageList){
      urlList.push(baseProductImage.url);
    }
    return urlList;
  }
  getImageURLColorVariantProduct(colorVariantProduct: ColorVariantProduct): string[]{
    let urlList: string[] = [];
    for(let colorVariantProductImage of colorVariantProduct.colorVariantProductImageList){
      urlList.push(colorVariantProductImage.url);
    }
    return urlList;
  }

  enableSizeButton(size: Size){
    let node = document.getElementById(`${size.size_id}`);
    node?.removeAttribute('disabled');
    node?.classList.remove('button--disabled');
    if(size.size_id === this.selectedSize.size_id){
        node?.classList.add('button--selected');
      }
  }
  disableSizeButton(size: Size){
    let node = document.getElementById(`${size.size_id}`);
    node?.classList.add('button--disabled');
    node?.setAttribute('disabled', 'true');
  }

}
