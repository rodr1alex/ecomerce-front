import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url: string = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.url}`);
  }
}
