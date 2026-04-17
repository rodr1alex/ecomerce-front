import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { Brand } from '../../models/general.model'; 
import { ProductBasicInfo } from '../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [ProductCardComponent, FilterComponent, PaginatorComponent, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  categoryName: string = 'Categoria A / Categoria B'; //IMPLEMENTAR SI O SI COMO OBTENER EL LISTADO DE LAS CATEGORIAS, LO DEBE ENTREGAR EL NAVBAR
  baseProductList!: ProductBasicInfo[];
  paginator!: any;
  brandList: Brand[] = [];
  url: string = '';
  categoriesIds: number[] = []

  constructor(
    private route: ActivatedRoute,
    private baseProductService: BaseProductService
    ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const page: number = +(params.get('page') || '0');
      const category_id: number = +(params.get('category') || '0');
      const subcategory_id: number = +(params.get('subcategory') || '0');
      this.url = `/product_list/${category_id}/${subcategory_id}`;
      this.categoriesIds = [category_id, subcategory_id]

      this.getBrandList()
      this.getProducts(page)

    });
  }

  async getBrandList() {
    try {
      const res = await firstValueFrom(this.baseProductService.getBrandList(this.categoriesIds))
      this.brandList = res

    } catch (err) {
      console.error('error getBrandList', err)
    }
  }

  async getProducts(page: number) {
    try {
      const pageable = await firstValueFrom(this.baseProductService.filterByCategoryList(page, this.categoriesIds))
      this.baseProductList = pageable.content as ProductBasicInfo[];
      this.paginator = pageable;
    } catch (err) {
      console.error('error getProducts', err)
    }
  }


}
