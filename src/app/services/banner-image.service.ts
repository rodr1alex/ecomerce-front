import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BannerImage } from '../models/banner-image.model';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BannerImageService {
  private baseUrl!: string;
  private url!: string;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    this.baseUrl = this.configService.baseUrl;
    this.url = `${this.baseUrl}/banner_images`
  }

  findAll(): Observable<BannerImage[]> {
    return this.http.get<BannerImage[]>(this.url);
  }

}
