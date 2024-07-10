import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinalProduct } from '../models/final-product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinalProductService {

  private url: string = 'http://localhost:8080/final_products';

  constructor(private http: HttpClient) { }

  create(finalProduct: FinalProduct): Observable<FinalProduct>{
    return this.http.post<FinalProduct>(`${this.url}/create`, finalProduct);
  }
}
