import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Direction } from '../models/general.model'; 
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/users/directions`
  }

  getByUserId(user_id :number): Observable<Direction[]>{
    return this.http.get<Direction[]>(`${this.url}/getByUser/${user_id}`);
  }

  create(direction: Direction, user_id :number): Observable<Direction>{
    return this.http.post<Direction>(`${this.url}/create/${user_id}`, direction);
  }

  update(direction: Direction): Observable<Direction>{
    return this.http.put<Direction>(`${this.url}/update/${direction.directionId}`, direction);
  }
  
  remove(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

}
