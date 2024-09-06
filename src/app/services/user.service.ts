import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private url: string = 'http://localhost:8080/users';

  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/users`
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page_size: number, page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/page/${page_size}/${page}`);
  }

  filter(role: Role, page_size: number, page: number): Observable<any> {
    return this.http.post<any[]>(`${this.url}/filter/${page_size}/${page}`, role);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: User): Observable<User>{
    return this.http.post<User>(this.url, user);
  }

  update(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }
  updatePassword(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/update_password/${user.id}`, user);
  }

  remove(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }


}
