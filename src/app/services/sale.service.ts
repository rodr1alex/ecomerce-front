import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private url: string = 'http://localhost:8080/sales';

  constructor(private http: HttpClient) { }

  createSale(cart_id: number): Observable<any>{
    return this.http.post<any>(`${this.url}/create/${cart_id}`, cart_id);
  }

}
