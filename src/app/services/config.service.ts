import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public baseUrl: string = 'http://18.231.193.172:8080'


  constructor() { }
}
