import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { CartForPayment, Page, ProductReturned, AdminSaleBasicInfo, AdminSaleDetail, SaleFilter, SaleStatus } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/sales`
  }

  findById(sale_id: number): Observable<AdminSaleDetail> {
    return this.http.get<AdminSaleDetail>(`${this.url}/${sale_id}`);
  }

  createSale(cart: CartForPayment): Observable<any> {
    return this.http.post<any>(`${this.url}/create`, cart);
  }

  filter(filter: SaleFilter): Observable<Page<AdminSaleBasicInfo>> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.pageSize.toString());

    // Añadimos solo lo que no es null o vacío
    if (filter.userId) params = params.set('user_id', filter.userId.toString());
    if (filter.saleStatusId) params = params.set('sale_status_id', filter.saleStatusId.toString());
    if (filter.startTotal) params = params.set('startTotal', filter.startTotal.toString());
    if (filter.endTotal) params = params.set('endTotal', filter.endTotal.toString());

    return this.http.post<Page<AdminSaleBasicInfo>>(`${this.url}/filter`, filter);
  }


  modifySale(sale_id: number, productsReturned: ProductReturned[]): Observable<any> {
    return this.http.put<any>(`${this.url}/modify/${sale_id}`, productsReturned);
  }


  cancelSale(sale_id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/cancel/${sale_id}`, {});
  }


  getSaleStatuses(): Observable<SaleStatus[]> {
    return this.http.get<SaleStatus[]>(`${this.url}/statuses`);
  }


}
