import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Direction } from '../models/direction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  private url: string = 'http://localhost:8080/users/directions';
  private user_id : number = 1;

  constructor(private http: HttpClient) { }

  create(direction: Direction): Observable<Direction>{
    return this.http.post<Direction>(`${this.url}/create/${this.user_id}`, direction);
  }
  update(direction: Direction): Observable<Direction>{
    return this.http.put<Direction>(`${this.url}/update/${direction.direction_id}`, direction);
  }
  remove(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

}
