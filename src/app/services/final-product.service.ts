import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { FilterAdminProduct } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class FinalProductService {

  //private url: string = 'http://localhost:8080/final_products';

  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/final_products`
  }

  // create(finalProduct: FinalProduct): Observable<FinalProduct>{
  //   return this.http.post<FinalProduct>(`${this.url}/create`, finalProduct);
  // }

  // findAllPageable(page: number, size: number): Observable<any> {
  //   return this.http.get<any[]>(`${this.url}/${size}/${page}`);
  // }

  //ok
  filter(filters: FilterAdminProduct): Observable<any> {
    return this.http.post<any>(`${this.url}/filter`, filters);
  }

  // update(finalProduct : FinalProduct, final_product_id: number): Observable<FinalProduct> {
  //   return this.http.put<FinalProduct>(`${this.url}/update/${final_product_id}`, finalProduct);
  // }

}
