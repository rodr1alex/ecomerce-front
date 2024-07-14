import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from '../models/direction.model';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private url: string = 'http://localhost:8080/sales';

  constructor(private http: HttpClient) { }

  findById(sale_id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.url}/${sale_id}`);
  }

  createSale(cart_id: number, direction: Direction, user_id: number): Observable<any>{
    return this.http.post<any>(`${this.url}/create/${cart_id}/${user_id}`, direction);
  }

  findAllPageable(pageSize: number, page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/${pageSize}/${page}`);
  }

  filter(user_id: number,startTotal: number, endTotal: number, pageSize: number, page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/filter/${user_id}/${startTotal}/${endTotal}/${pageSize}/${page}`);
  }
}
