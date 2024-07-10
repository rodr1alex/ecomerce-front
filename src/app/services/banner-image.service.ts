import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BannerImage } from '../models/banner-image.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerImageService {

  private url: string = 'http://localhost:8080/banner_images';

  constructor(private http: HttpClient) { }

  findAll(): Observable<BannerImage[]> {
    return this.http.get<BannerImage[]>(this.url);
  }

}
