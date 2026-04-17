import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { CartForPayment, ProductReturned, Sale, SaleDetail, SaleFilter } from '../models/general.model';

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

  findById(sale_id: number): Observable<SaleDetail> {
    return this.http.get<SaleDetail>(`${this.url}/${sale_id}`);
  }

  // findAllPageable(pageSize: number, page: number): Observable<any> {
  //   return this.http.get<any[]>(`${this.url}/${pageSize}/${page}`);
  // }

  createSale(cart: CartForPayment): Observable<any> {
    return this.http.post<any>(`${this.url}/create`, cart);
  }

  filter(filter: SaleFilter): Observable<any> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.pageSize.toString());

    // Añadimos solo lo que no es null o vacío
    if (filter.user_id) params = params.set('user_id', filter.user_id.toString());
    if (filter.sale_status_id) params = params.set('sale_status_id', filter.sale_status_id.toString());
    if (filter.startTotal) params = params.set('startTotal', filter.startTotal.toString());
    if (filter.endTotal) params = params.set('endTotal', filter.endTotal.toString());

    return this.http.post<any[]>(`${this.url}/filter`, filter);
  }

  modifySale(sale_id: number, productsReturned: ProductReturned[]): Observable<any> {
    return this.http.put<any>(`${this.url}/modify/${sale_id}`, productsReturned);
  }

  cancelSale(sale_id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/cancel/${sale_id}`, {});
  }

  getSaleStatuses(): Observable<any> {
    return this.http.get<any>(`${this.url}/statuses`);
  }


}
