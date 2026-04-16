import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FinalProductService } from '../../../services/final-product.service';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { Color } from '../../../models/color.model';
import { Size } from '../../../models/size.model';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { ColorService } from '../../../services/color.service';
import { SizeService } from '../../../services/size.service';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { AdminFinalProductDTO, FilterAdminProduct, Page } from '../../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, PaginatorComponent],
  templateUrl: './view-product.component.html'
})

export class ViewProductComponent implements OnInit {
  categoryList: Category[] = [];
  brandList: Brand[] = []
  colorList: Color[] = [];
  sizeList: Size[] = [];
  paginator: Page<AdminFinalProductDTO> = new Page()
  pageSizeList: number[] = [5, 10, 20, 50, 100, 200, 500];
  filters: FilterAdminProduct = new FilterAdminProduct()

  constructor(
    private finalProductService: FinalProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const page: number = +(this.route.snapshot.paramMap.get('page') || '0')
    this.filters.page = page

    this.categoryService.getAll().subscribe({
      next: response => {
        this.categoryList = response;
      }
    })

    this.brandService.getAll().subscribe({
      next: response => {
        this.brandList = response;
      }
    });

    this.colorService.getAll().subscribe({
      next: response => {
        this.colorList = response;
      }
    });

    this.sizeService.getAll().subscribe({
      next: response => {
        this.sizeList = response;
      }
    })

    this.onFilter()

  }

  onChange(event: Event) {
    this.onFilter()
  }

  async onFilter() {
    try {
      const res = await firstValueFrom(this.finalProductService.filter(this.filters))
      this.paginator = res
    } catch (error) { 
      console.error('error en filtrar', error)
    }

  }

  unfilter() {
    this.filters.reset()
    this.onFilter();
  }

  removeSizeFilter() {
    this.filters.size_id = null
    this.onFilter();
  }

  removeCategoryFilter() {
    this.filters.categories = []
    this.onFilter();
  }

  removeBrandFilter() {
    this.filters.brand_id = null
    this.onFilter();
  }

  removeColorFilter() {
    this.filters.color_id = null
    this.onFilter();
  }

   paginatorListener(event: any) {
    this.filters.page = event
    this.onFilter()
  }

}
