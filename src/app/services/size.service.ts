import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../models/size.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  //private url: string = 'http://localhost:8080/sizes';

  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/sizes`
  }

  getAll(): Observable<Size[]>{
    return this.http.get<Size[]>(`${this.url}`);
  }
}
