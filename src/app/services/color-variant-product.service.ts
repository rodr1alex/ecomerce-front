import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColorVariantProduct } from '../models/color-variant-product.model';
import { ColorVariantProductImage } from '../models/color-variant-product-image.model';

@Injectable({
  providedIn: 'root'
})
export class ColorVariantProductService {

  private url: string = 'http://localhost:8080/color_variant_products';

  constructor(private http: HttpClient) { }

  create(colorVariantProduct :ColorVariantProduct): Observable<ColorVariantProduct>{
    return this.http.post<ColorVariantProduct>(`${this.url}/create`, colorVariantProduct);
  }
  updateBaseProduct(colorVariantProduct: ColorVariantProduct, color_variant_product_id: number): Observable<ColorVariantProduct> {
    return this.http.put<ColorVariantProduct>(`${this.url}/update/${color_variant_product_id}`, colorVariantProduct);
  }
  addColorVariantProductImage(colorVariantProductImage: ColorVariantProductImage, color_variant_product_id: number): Observable<ColorVariantProduct> {
    return this.http.put<ColorVariantProduct>(`${this.url}/update/add_image/${color_variant_product_id}`, colorVariantProductImage);
  }
  romoveColorVariantProductImage(colorVariantProductImage: ColorVariantProductImage, color_variant_product_id: number): Observable<ColorVariantProduct> {
    return this.http.put<ColorVariantProduct>(`${this.url}/update/remove_image/${color_variant_product_id}`, colorVariantProductImage);
  }
}
