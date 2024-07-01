import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class BaseProductService {
  private url: string = 'http://localhost:8080/base_products';
  private user_id : number = 1;

  constructor(private http: HttpClient) { }

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
