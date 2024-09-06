import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from '../models/direction.model';
import { Sale } from '../models/sale.model';
import { OrderedProduct } from '../models/ordered-product.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  //private url: string = 'http://localhost:8080/sales';

  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/sales`
  }

  findById(sale_id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.url}/${sale_id}`);
  }

  findAllPageable(pageSize: number, page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/${pageSize}/${page}`);
  }

  createSale(cart_id: number, direction: Direction, user_id: number): Observable<any>{
    return this.http.post<any>(`${this.url}/create/${cart_id}/${user_id}`, direction);
  }

  filter(user_id: number,startTotal: number, endTotal: number, pageSize: number, page: number, status: string): Observable<any> {
    return this.http.get<any[]>(`${this.url}/filter/${user_id}/${startTotal}/${endTotal}/${pageSize}/${page}/${status}`);
  }

  modifySale(sale_id: number, orderedProductList: OrderedProduct[]): Observable<any>{
    return this.http.put<any>(`${this.url}/modify/${sale_id}`, orderedProductList);
  }

 
}
