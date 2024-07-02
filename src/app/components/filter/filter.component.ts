import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { BaseProduct } from '../../models/base-product.model';
import { Category } from '../../models/category.model';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html'
})

export class FilterComponent  {
  @Input() brandList!: Brand[];
  baseProductList!: BaseProduct[];
  paginator!: any;

  orderByList: String[]= [
    'Nombre A-Z',
    'Nombre Z-A ',
    'Menor precio',
    'Mayor precio'
  ];
  
  orderBySelected: String = '';
  brandSelected: String = '';
  showFilter: boolean = false;
  category1: Category = new Category(1,'asfd');
  category2: Category = new Category(2,'afds');
  categoryList: Category[] = [];

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.baseProductList = state.baseProductList;
        this.paginator = state.paginator;
      })
  }
  onChange(event: Event){
    this.filter();
  }

  showHiddenFilter(){
    const node = document.getElementById('orderBy');
    this.showFilter == false? 
    (this.showFilter = true, node?.classList.remove('hidden')) : 
    (this.showFilter = false, node?.classList.add('hidden'));
  }

  filter(){
    this.category1.category_id = 6;
    this.category1.category_id = 4;
    this.categoryList.push(this.category1);
    this.categoryList.push(this.category1);
    this.baseProductService.filterByBrand(0,+this.brandSelected,this.categoryList).subscribe({
      next: pageable => {
        this.baseProductList = pageable.content as BaseProduct[];
        this.paginator = pageable;
        this.sharingDataService.pageProductEventEmitter.emit({baseProductList: this.baseProductList, paginator: this.paginator})
      }
    })
  }

}
