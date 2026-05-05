import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { BasicProductInfo, AdminBaseProduct, Page, ProductDetail, Brand, BasicProductFilter } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class BaseProductService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/base_products`
  }

  create(baseProduct: any):Observable<any>{
    return this.http.post<any>(`${this.url}/create`, baseProduct); 
  }

  findById(base_product_id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.url}/${base_product_id}`);
  }

  getAdminBaseProductById(base_product_id: number): Observable<AdminBaseProduct> {
    return this.http.get<AdminBaseProduct>(`${this.url}/admin/${base_product_id}`);
  }

  getFeaturedProducts(): Observable<BasicProductInfo[]> {
    return this.http.get<BasicProductInfo[]>(`${this.url}/featured_products`);
  }

  // filterByBrand(page: number, brand_id: number, categories: number[]): Observable<Page<BasicProductInfo>> {
  //   return this.http.post<Page<BasicProductInfo>>(`${this.url}/filter/brand/${brand_id}/page/${page}`, categories);
  // }

  // filterByCategoryList(page: number, categories: number[]): Observable<Page<BasicProductInfo>> {
  //   return this.http.post<Page<BasicProductInfo>>(`${this.url}/filter/category_list/page/${page}`, categories);
  // }

  filter(filter: BasicProductFilter): Observable<Page<BasicProductInfo>> {
    return this.http.post<Page<BasicProductInfo>>(`${this.url}/filter`, filter);
  }
  
  getBrandList(categories: number[]): Observable<Brand[]> {
    return this.http.post<Brand[]>(`${this.url}/filter/brand/get_list`, categories);
  }

  
}
