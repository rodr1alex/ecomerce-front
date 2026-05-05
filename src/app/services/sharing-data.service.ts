import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/general.model';


@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _handlerLoginEventEmitter: EventEmitter<User> = new EventEmitter();
  private _closeCartEventEmitter: EventEmitter<void> = new EventEmitter(); 
  private _showSearchBarEventEmitter: EventEmitter<void> = new EventEmitter(); 
  private _hideSearchBarEventEmitter: EventEmitter<void> = new EventEmitter(); 
  private _clickEventEmitter: EventEmitter<any> = new EventEmitter(); 
  private _breadcrumbCategoriesEventEmitter: EventEmitter<string[]> = new EventEmitter(); 

  
  constructor() { }

  get handlerLoginEventEmitter (){
    return this._handlerLoginEventEmitter;
  }
  get closeCartEventEmitter(){
    return this._closeCartEventEmitter;
  }
  get showSearchBarEventEmitter(){
    return this._showSearchBarEventEmitter;
  }
  get hideSearchBarEventEmitter(){
    return this._hideSearchBarEventEmitter;
  }
  get clickEventEmitter(){
    return this._clickEventEmitter;
  }
  get breadcrumbCategoriesEventEmitter(){
    return this._breadcrumbCategoriesEventEmitter
  }
  
}
