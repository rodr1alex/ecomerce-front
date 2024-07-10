import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColorVariantProduct } from '../models/color-variant-product.model';

@Injectable({
  providedIn: 'root'
})
export class ColorVariantProductService {

  private url: string = 'http://localhost:8080/color_variant_products';

  constructor(private http: HttpClient) { }

  create(colorVariantProduct :ColorVariantProduct): Observable<ColorVariantProduct>{
    return this.http.post<ColorVariantProduct>(`${this.url}/create`, colorVariantProduct);
  }
}
