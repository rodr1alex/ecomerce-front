import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Direction } from '../models/direction.model';

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
}
