import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { BaseProduct } from '../../models/base-product.model';
import { Category } from '../../models/category.model';
import { BaseProductImage } from '../../models/base-product-image.model';
import { update } from '../../store/base-product.action';
import { Brand } from '../../models/brand.model';
import { ProductBasicInfo } from '../../models/products-general.model';
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
  baseProduct!: BaseProduct;
  //categoryListToFilter: Category[] = [];
  brandList: Brand[] = [];
  url: string = '';
  categoriesIds: number[] = []

  constructor(
    private baseProductStore: Store<{ baseProducts: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
    this.baseProductStore.select('baseProducts').subscribe(state => {
      this.baseProductList = state.baseProductList;
      this.paginator = state.paginator;
      this.baseProduct = state.baseProduct;
    })

  }

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
      //this.sharingDataService.pageProductEventEmitter.emit({ baseProductList: this.baseProductList, paginator: this.paginator })
    } catch (err) {
      console.error('error getProducts', err)
    }
  }


}
