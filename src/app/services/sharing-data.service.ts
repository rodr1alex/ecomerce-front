import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Direction } from '../models/direction.model';
import { OrderedProduct } from '../models/ordered-product.model';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _handlerLoginEventEmitter: EventEmitter<User> = new EventEmitter();
  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _updateUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _createDirectionEventEmitter: EventEmitter<Direction> = new EventEmitter(); 
  private _updateDirectionEventEmitter: EventEmitter<Direction> = new EventEmitter();
  private _deleteDirectionEventEmitter: EventEmitter<number> = new EventEmitter();
  private _pageProductEventEmitter: EventEmitter<any> = new EventEmitter();
  private _addProductToCartEventEmitter: EventEmitter<OrderedProduct> = new EventEmitter(); //any: {CartUpdated, }
  private _modifyProductQuantityCartEventEmitter: EventEmitter<any> = new EventEmitter();
  private _removeProductCartEventEmitter: EventEmitter<OrderedProduct> = new EventEmitter();
  private _cleanCartEventEmitter: EventEmitter<void> = new EventEmitter(); 

  constructor() { }

  get handlerLoginEventEmitter (){
    return this._handlerLoginEventEmitter;
  }
  get newUserEventEmitter(){
    return this._newUserEventEmitter;
  }
  get updateUserEventEmitter(){
    return this._updateUserEventEmitter;
  }
  get createDirectionEventEmitter(){
    return this._createDirectionEventEmitter;
  }
  get updateDirectionEventEmitter(){
    return this._updateDirectionEventEmitter;
  }
  get deleteDirectionEventEmitter(){
    return this._deleteDirectionEventEmitter
  }
  get pageProductEventEmitter(){
    return this._pageProductEventEmitter;
  }
  get addProductToCartEventEmitter(){
    return this._addProductToCartEventEmitter;
  }
  get modifyProductQuantityCartEventEmitter(){
    return this._modifyProductQuantityCartEventEmitter;
  }
  get removeProductCartEventEmitter(){
    return this._removeProductCartEventEmitter;
  }
  get cleanCartEventEmitter(){
    return this._cleanCartEventEmitter;
  }
}
