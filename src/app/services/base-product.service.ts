import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { BaseProduct } from '../models/base-product.model';

@Injectable({
  providedIn: 'root'
})
export class BaseProductService {
  private url: string = 'http://localhost:8080/base_products';
  private user_id : number = 1;

  constructor(private http: HttpClient) { }

  create(baseProduct: BaseProduct):Observable<BaseProduct>{
    return this.http.post<BaseProduct>(`${this.url}/create`, baseProduct); 
  }

  findById(base_product_id: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/${base_product_id}`);
  }

  findAllPageable(page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/featured_products/page/${page}`);
  }

  filterByBrand(page: number, brand_id: number, categoryList: any): Observable<any> {
    return this.http.post<any[]>(`${this.url}/filter/brand/${brand_id}/page/${page}`, categoryList);
  }

  filterByCategoryList(page: number, categoryList: any): Observable<any> {
    return this.http.post<any>(`${this.url}/filter/category_list/page/${page}`, categoryList);
  }
  
  getBrandList(categoryList: any): Observable<any> {
    return this.http.post<any>(`${this.url}/filter/brand/get_list`, categoryList);
  }
  
}
