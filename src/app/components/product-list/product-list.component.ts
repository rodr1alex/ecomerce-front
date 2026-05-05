import { Component, Input, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { BasicProductFilter, Brand, Page } from '../../models/general.model';
import { BasicProductInfo } from '../../models/general.model';
import { firstValueFrom } from 'rxjs';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [ProductCardComponent, FilterComponent, PaginatorComponent, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  categoryName: string = ''
  paginator: Page<BasicProductInfo> = new Page
  brandList: Brand[] = [];
  filter: BasicProductFilter = new BasicProductFilter()

  constructor(
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category_id: number = +(params.get('category') || '0');
      const subcategory_id: number = +(params.get('subcategory') || '0');
      this.filter.categoriesIds = [category_id, subcategory_id]
      this.filter.brandId = null
      this.getBrandList()
      this.getProductsWithFilters()
    });

    this.subcribeBreadCrumb()
  }

  subcribeBreadCrumb() {
    this.sharingDataService.breadcrumbCategoriesEventEmitter.subscribe(data => {
      this.categoryName = ''
      data.forEach((item, index) => {
        this.categoryName = this.categoryName + item
        if (index != data.length - 1) this.categoryName = this.categoryName + ' / '
      })
    })
  }

  async getProductsWithFilters() {
    try {
      const res = await firstValueFrom(this.baseProductService.filter(this.filter))
      this.paginator = res
    } catch (error) {
      console.error('error en filtrar productos', error)
    }
  }

  async getBrandList() {
    try {
      const res = await firstValueFrom(this.baseProductService.getBrandList(this.filter.categoriesIds!))
      this.brandList = res
    } catch (err) {
      console.error('error getBrandList', err)
    }
  }

  paginatorListener(event: any) {
    this.filter.page = event
    this.getProductsWithFilters()
  }

  filterByBrandListener(event: any) {
    this.filter.brandId = event
    this.getProductsWithFilters()
  }

}
