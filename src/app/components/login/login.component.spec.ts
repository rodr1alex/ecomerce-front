/// <reference types="jasmine" />

import { EventEmitter } from '@angular/core';
import { LoginComponent } from './login.component';
import { User } from '../../models/general.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let sharingDataServiceMock: { handlerLoginEventEmitter: EventEmitter<User> };
  let routerMock: { navigate: jasmine.Spy };
  let alertServiceMock: { error: jasmine.Spy };

  beforeEach(() => {
    sharingDataServiceMock = {
      handlerLoginEventEmitter: new EventEmitter<User>()
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    alertServiceMock = {
      error: jasmine.createSpy('error')
    };

    component = new LoginComponent(
      sharingDataServiceMock as any,
      routerMock as any,
      alertServiceMock as any
    );
  });

  it('should show error and not emit login when credentials are missing', () => {
    spyOn(sharingDataServiceMock.handlerLoginEventEmitter, 'emit');

    component.user.username = '';
    component.user.password = '';
    component.onLogon();

    expect(alertServiceMock.error).toHaveBeenCalledWith('Error', 'Credenciales incorrectas!');
    expect(sharingDataServiceMock.handlerLoginEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should emit user when credentials are valid', () => {
    spyOn(sharingDataServiceMock.handlerLoginEventEmitter, 'emit');

    component.user.username = 'juan';
    component.user.password = '123456';
    component.onLogon();

    expect(alertServiceMock.error).not.toHaveBeenCalled();
    expect(sharingDataServiceMock.handlerLoginEventEmitter.emit).toHaveBeenCalledWith(component.user);
  });
});
