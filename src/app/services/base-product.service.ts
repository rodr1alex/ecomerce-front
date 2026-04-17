import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Page, ProductBasicInfo } from '../models/general.model';

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

  findById(base_product_id: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/${base_product_id}`);
  }

  findProductAdminById(base_product_id: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/admin/${base_product_id}`);
  }

  findAllPageable(page: number): Observable<any> {
    //return this.http.get<any[]>(`${this.url}/featured_products/page/${page}`);
    return this.http.get<any[]>(`${this.url}`);
  }

  filterByBrand(page: number, brand_id: number, categoryList: any): Observable<Page<ProductBasicInfo>> {
    return this.http.post<Page<ProductBasicInfo>>(`${this.url}/filter/brand/${brand_id}/page/${page}`, categoryList);
  }

  filterByCategoryList(page: number, categoryList: any): Observable<any> {
    return this.http.post<any>(`${this.url}/filter/category_list/page/${page}`, categoryList);
  }
  
  getBrandList(categoryList: any): Observable<any> {
    return this.http.post<any>(`${this.url}/filter/brand/get_list`, categoryList);
  }

  // updateBaseProduct(baseProduct: BaseProduct, base_product_id: number): Observable<BaseProduct> {
  //   return this.http.put<BaseProduct>(`${this.url}/update/${base_product_id}`, baseProduct);
  // }

  // addBaseProductImage(baseProductImage: BaseProductImage, base_product_id: number): Observable<BaseProduct> {
  //   return this.http.put<BaseProduct>(`${this.url}/update/add_image/${base_product_id}`, baseProductImage);
  // }
  // removeBaseProductImage(baseProductImage: BaseProductImage, base_product_id: number): Observable<BaseProduct> {
  //   return this.http.put<BaseProduct>(`${this.url}/update/remove_image/${base_product_id}`, baseProductImage);
  // }
  
}
