import { Injectable } from '@angular/core';
import { User } from '../models/general.model'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { UserFilter } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/users`
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  filter(filter: UserFilter): Observable<any> {
    return this.http.post<any[]>(`${this.url}/filter`, filter);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/create`, user);
  }

  update(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }
  
  updatePassword(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/update_password/${user.id}`, user);
  }

  //try remove
  remove(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }


}
