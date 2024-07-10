import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private url: string = 'http://localhost:8080/brands';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Brand[]>{
    return this.http.get<Brand[]>(`${this.url}`);
  }

}
