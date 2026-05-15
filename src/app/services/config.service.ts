import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // public baseUrl: string = 'http://localhost:8080'
  public baseUrl: string = 'http://54.227.195.43:8080'
  
  constructor() { }

}
