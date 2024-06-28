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

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent {
  baseProduct!: BaseProduct;
  baseProductList!: BaseProduct[];
  cantidad: number = 0;
  selectedSize: String = '';
  sizeList: String[] = [];
  colorList: any[] = [];
  selectedColor!: String;
  imageList: String[] = []
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

  getImageList(){
    this.imageList = [];
    this.baseProduct.baseProductImageList.map(item => this.imageList.push(item.url));
  }
  getColorList(){
    this.colorList = [];
    this.baseProduct.colorVariantProductList.map(colorVariantProduct => this.colorList.push({"className": colorVariantProduct.color.tailwindclass, "colorName": colorVariantProduct.color.name}));
  }
  getSizeList(){
    this.sizeList = [];
    this.baseProduct.colorVariantProductList.map(colorVariantProduct => colorVariantProduct.finalProductList.map(finalProduct => this.sizeList.push(finalProduct.size.name)))
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
    if(this.cantidad > 0){
      this.cantidad --;
    }
  }
  increase(){
    this.cantidad ++;
  }
  setSelectedSize(size: String){
    this.selectedSize = size;
  }
  selectedImageIndex(i: number){
    this.currentIndex = i;
  }
  setSelectedColor(colorName: String){
    this.selectedColor = colorName;
  }
}
