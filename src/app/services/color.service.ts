import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from '../models/color.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private url: string = 'http://localhost:8080/colors';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Color[]>{
    return this.http.get<Color[]>(`${this.url}`);
  }
}
