import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

export class FilterComponent implements OnInit {
  @Input() brandList!: Brand[];
  @Input() categoryList!: Category[];
  baseProductList!: BaseProduct[];
  paginator!: any;
  clickInFilter: boolean = false;
  clickInFilterHeader: boolean = false;

  orderByList: String[]= [
    'Nombre A-Z',
    'Nombre Z-A ',
    'Menor precio',
    'Mayor precio'
  ];
  
  orderBySelected: String = '';
  brandSelected: String = '';

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
  ngOnInit(): void {
    this.clickHanddler();
    this.cleanBrandList();
  }
  onChange(event: Event){
    this.filter();
  }

  cleanBrandList(){
    // const sizeListClean: Size[] = [];
    // const indexList: number[] = [];
    // sizeList.map(size => {
    //   if(indexList.indexOf(size.size_id) === -1){
    //     indexList.push(size.size_id);
    //     sizeListClean.push(size);
    //   }
    // })
    console.log('que xua la brandlist',this.brandList)
    const brandListClean: Brand [] = [];
    const indexList: number[] = [];
    this.brandList.map(brand =>{
      if(indexList.indexOf(brand.brand_id) === -1){
        indexList.push(brand.brand_id);
        brandListClean.push(brand);
      }
    }) 
    console.log('la wea ', brandListClean);
    this.brandList = brandListClean;
  }

  filter(){
    this.baseProductService.filterByBrand(0,+this.brandSelected,this.categoryList).subscribe({
      next: pageable => {
        this.baseProductList = pageable.content as BaseProduct[];
        this.paginator = pageable;
        this.sharingDataService.pageProductEventEmitter.emit({baseProductList: this.baseProductList, paginator: this.paginator})
      }
    })
  }

  clickHanddler(){
    this.sharingDataService.clickrEventEmitter.subscribe(({width, height})=>{
      console.log('Info: ', width, height);
      if(width > 768){
        if(this.clickInFilter){
          this.showFilter();
          this.clickInFilter = false
        }else{
          this.hiddeFilter();
        }
      }
    })
  }

  clickFilterMobile(){
    this.clickInFilterHeader?  (this.showFilter(), this.clickInFilterHeader = false):(this.hiddeFilter(), this.clickInFilterHeader = true);
  }
 
  showFilter(){
    const filterNode = document.getElementById('filterNode');
    const orderByNode = document.getElementById('orderBy');
    orderByNode?.classList.remove('hidden')
    filterNode?.classList.add('h-48')
    filterNode?.classList.remove('rounded-full')
    filterNode?.classList.add('rounded-xl')
    filterNode?.classList.remove('w-2/5')
    filterNode?.classList.add('w-full')
    filterNode?.classList.add('z-10');
  }
  hiddeFilter(){
    const filterNode = document.getElementById('filterNode');
    const orderByNode = document.getElementById('orderBy');
    orderByNode?.classList.add('hidden'),
    filterNode?.classList.remove('h-48'),
    filterNode?.classList.add('rounded-full'),
    filterNode?.classList.remove('rounded-xl')
    filterNode?.classList.add('w-2/5')
    filterNode?.classList.remove('w-full')
    filterNode?.classList.remove('z-10')
  }

  clickOrderBy(){
    const orderByNode = document.getElementById('orderBy');
    orderByNode?.classList.add('h-48')
    orderByNode?.classList.remove('rounded-full')
    orderByNode?.classList.add('rounded-xl')
  }

}
