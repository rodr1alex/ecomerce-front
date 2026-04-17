import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { Brand } from '../../models/general.model';
import { Page, ProductBasicInfo } from '../../models/general.model';

@Component({
  selector: 'filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html'
})

export class FilterComponent implements OnInit {
  @Input() brandList!: Brand[];
  @Input() categoriesIds!: number[];
  paginator!: Page<ProductBasicInfo>;
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
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService) {

  }
  ngOnInit(): void {
    this.clickHanddler();
  }
  onChange(event: Event){
    this.filter();
  }
  
  filter(){
    this.baseProductService.filterByBrand(0,+this.brandSelected,this.categoriesIds).subscribe({
      next: pageable => {
        this.paginator = pageable
      }
    })
  }

  clickHanddler(){
    this.sharingDataService.clickEventEmitter.subscribe(({width, height})=>{
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
