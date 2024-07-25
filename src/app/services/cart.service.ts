import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Observable } from 'rxjs';
import { OrderedProduct } from '../models/ordered-product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private url: string = 'http://localhost:8080/cart';

  constructor(private http: HttpClient) { }

  create(user_id: number): Observable<Cart>{
    return this.http.post<Cart>(`${this.url}/create/${user_id}`, user_id);
  }

  findById(cart_id: number): Observable<Cart>{
    return this.http.get<Cart>(`${this.url}/${cart_id}`);
  }

  findAll(): Observable<Cart[]>{
    return this.http.get<Cart[]>(`${this.url}`);
  }

  addProduct(cart_id: number,orderedProduct: OrderedProduct ): Observable<Cart>{
    return this.http.put<Cart>(`${this.url}/update/add_product/${cart_id}`, orderedProduct);
  }

  removeProduct(cart_id: number,final_product_id: number ): Observable<Cart>{
    return this.http.put<Cart>(`${this.url}/update/remove_product/${cart_id}/${final_product_id}`, final_product_id);
  }

  updateProductQuantity(cart_id: number,orderedProduct: OrderedProduct ): Observable<Cart>{
    return this.http.put<Cart>(`${this.url}/update/quantity_product/${cart_id}`, orderedProduct);
  }

  cleanCart(cart_id: number): Observable<Cart>{
    return this.http.put<Cart>(`${this.url}/update/clean/${cart_id}`, cart_id);
  }


}



// @PutMapping("/update/clean/{cart_id}")
//   public Cart cleanCart(@PathVariable Long cart_id){
//     return this.cartService.cleanCart(cart_id);
//   }