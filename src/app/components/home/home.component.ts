import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { DirectionService } from '../../services/direction.service';
import { BaseProduct } from '../../models/base-product.model';
import { BaseProductService } from '../../services/base-product.service';
import { BannerImageService } from '../../services/banner-image.service';
import { BannerImage } from '../../models/banner-image.model';

@Component({
  selector: 'home',
  standalone: true,
  imports: [RouterModule,CommonModule, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  baseProductList!: BaseProduct[];
  paginator!: any;
  bannerImageList: BannerImage[] = [];

  currentIndex = 0;
  touchStartX = 0;
  touchEndX = 0;


  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private bannerImageService: BannerImageService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.baseProductList = state.baseProductList;
        this.paginator = state.paginator;
      })
    
  }

  
  ngOnInit(): void {
    this.sharingDataService.showSearchBarEventEmitter.emit();
    setInterval(()=>{
      this.next();
    }, 7000);
    this.bannerImageService.findAll().subscribe({
      next: response =>{
        this.bannerImageList = response;
      }
    })
    this.baseProductService.findAllPageable(0).subscribe({
      next: pageable =>{
        this.baseProductList = pageable.content as BaseProduct[];
        this.paginator = pageable;
        this.sharingDataService.pageProductEventEmitter.emit({baseProductList: this.baseProductList, paginator: this.paginator})
      },
      error: error =>{
        throw new error;
      }
    })
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
  hola(i: number){
    this.currentIndex = i;
  }
}
