import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../models/size.model';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  private url: string = 'http://localhost:8080/sizes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Size[]>{
    return this.http.get<Size[]>(`${this.url}`);
  }
}
