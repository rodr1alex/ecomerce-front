import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public baseUrl: string = 'http://localhost:8080'
  
  constructor() { }

}
