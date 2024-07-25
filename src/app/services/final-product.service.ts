import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinalProduct } from '../models/final-product.model';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class FinalProductService {

  private url: string = 'http://localhost:8080/final_products';

  constructor(private http: HttpClient) { }

  create(finalProduct: FinalProduct): Observable<FinalProduct>{
    return this.http.post<FinalProduct>(`${this.url}/create`, finalProduct);
  }

  findAllPageable(page: number, size: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/${size}/${page}`);
  }

  filter(brand_id: number, color_id: number, size_id: number, size: number, page: number, categoryList: Category[]): Observable<any> {
    return this.http.post<any[]>(`${this.url}/filter/${brand_id}/${color_id}/${size_id}/${size}/${page}`, categoryList);
  }

  update(finalProduct : FinalProduct, final_product_id: number): Observable<FinalProduct> {
    return this.http.put<FinalProduct>(`${this.url}/update/${final_product_id}`, finalProduct);
  }

}
