import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/brands`
  }

  //private url: string = 'http://localhost:8080/brands';

  
  getAll(): Observable<Brand[]>{
    return this.http.get<Brand[]>(`${this.url}`);
  }

}
