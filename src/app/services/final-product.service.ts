import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AdminFinalProduct, FilterAdminProduct, Page } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class FinalProductService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/final_products`
  }

  filter(filters: FilterAdminProduct): Observable<Page<AdminFinalProduct>> {
    return this.http.post<Page<AdminFinalProduct>>(`${this.url}/filter`, filters);
  }

}
