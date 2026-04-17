import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { BaseProductService } from '../../services/base-product.service';
import { BannerImageService } from '../../services/banner-image.service';

import { BannerImage, ProductBasicInfo } from '../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'home',
  standalone: true,
  imports: [RouterModule,CommonModule, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  baseProductList!: ProductBasicInfo[]
  bannerImageList: BannerImage[] =[]
  currentIndex: number = 0
  touchStartX: number = 0
  touchEndX: number = 0
  timeToSwitchImage: number = 7000

  constructor(private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private bannerImageService: BannerImageService) { }

  
  async ngOnInit(): Promise<void> {
    this.sharingDataService.showSearchBarEventEmitter.emit()
    await this.getBannerImages()
    setInterval(()=>this.next(), this.timeToSwitchImage)
    this.getProducts()
  }

  async getBannerImages(){
    try{
      const res = await firstValueFrom(this.bannerImageService.findAll())
      this.bannerImageList = res  
    }catch(err){
      console.error('error en getBannerImages', err)
    }
  }

  async getProducts(){
    try{
      const res = await firstValueFrom(this.baseProductService.findAllPageable(0))
      this.baseProductList = res
    }catch(err){
      console.error('error en getProducts', err)
    }
  }


  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.bannerImageList.length - 1 : this.currentIndex - 1;
  }

  next() {
    this.currentIndex = (this.currentIndex === this.bannerImageList.length - 1) ? 0 : this.currentIndex + 1;
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

  setCurrentIndex(i: number){
    this.currentIndex = i;
  }

}
