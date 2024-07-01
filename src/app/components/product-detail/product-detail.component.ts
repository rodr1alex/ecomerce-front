import { Component } from '@angular/core';
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

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent {
  baseProduct!: BaseProduct;
  baseProductList!: BaseProduct[];
  quantity: number = 0;
  selectedSize!: Size;
  selectedColor!: Color;
  sizeList: Size[] = [];
  colorList: Color[] = [];
  imageList: BaseProductImage[] = []
  currentIndex = 0;
  touchStartX = 0;
  touchEndX = 0;

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.baseProduct = state.baseProduct;
        this.baseProductList = state.baseProductList;
        
      })
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const base_product_id = +(params.get('base_product_id') || '0');
      this.baseProductStore.dispatch(find({base_product_id}));
      this.getImageList();
      this.getColorList();
      this.getSizeList();
    })
    
  }

  //TALLA Y COLOR NO ESTAN EN CONCORDANCIA, MEJORAR.
  getImageList(){
    this.imageList = [];
    this.baseProduct.baseProductImageList.map(baseProductImage => this.imageList.push(baseProductImage));
  }
  getColorList(){
    this.colorList = [];
    this.baseProduct.colorVariantProductList.map(colorVariantProduct => this.colorList.push(colorVariantProduct.color));
  }
  getSizeList(){
    this.sizeList = [];
    this.baseProduct.colorVariantProductList.map(colorVariantProduct => colorVariantProduct.finalProductList.map(finalProduct => this.sizeList.push(finalProduct.size)))
  }
  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.imageList.length - 1 : this.currentIndex - 1;
  }
  next() {
    this.currentIndex = (this.currentIndex === this.imageList.length - 1) ? 0 : this.currentIndex + 1;
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
  }
  selectedImageIndex(i: number){
    this.currentIndex = i;
  }
  setSelectedColor(colorName: Color){
    this.selectedColor = colorName;
  }
  getFinalProduct(): FinalProduct{
    const color_id = this.selectedColor.color_id;
    const size_id = this.selectedSize.size_id;
    console.log(`Se filtrara por color_id: ${color_id}, y por size_id: ${size_id}`);
    return (this.baseProduct.colorVariantProductList.filter(colorVariantProduct => colorVariantProduct.color.color_id === color_id)[0].finalProductList.filter(finalProduct => finalProduct.size.size_id === size_id)[0]);
  }

  addProductToCart(){
    const orderedProduct = new OrderedProduct();
    orderedProduct.quantity = this.quantity;
    orderedProduct.finalProduct = this.getFinalProduct();
    this.sharingDataService.addProductToCartEventEmitter.emit(orderedProduct);
  }

}
