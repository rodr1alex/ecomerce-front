import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { BaseProduct } from '../../models/base-product.model';
import { Category } from '../../models/category.model';
import { BaseProductImage } from '../../models/base-product-image.model';
import { update } from '../../store/base-product.action';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [ProductCardComponent, FilterComponent, PaginatorComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit{
  categoryName: string = 'Zapatos de trekking'
  baseProductList!: BaseProduct[];
  paginator!: any;
  baseProduct!: BaseProduct;
  category1: Category = new Category;
  category2: Category = new Category;
  categoryList: Category[] = [];

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.baseProductList = state.baseProductList;
        this.paginator = state.paginator;
        this.baseProduct = state.baseProduct;
      })
    
  }

  ngOnInit(): void {
    this.category1.category_id = 4;
    this.category2.category_id = 6;
    this.categoryList.push(this.category1);
    this.categoryList.push(this.category1);
    this.baseProductService.filterByCategoryList(0, this.categoryList).subscribe({
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

  
}
