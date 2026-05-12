/// <reference types="jasmine" />

import { EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { PaymentComponent } from './payment.component';
import { Cart, Direction, ProductInCart } from '../../models/general.model';
import { cleanCart } from '../../store/cart/cart.action';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let routerMock: { navigate: jasmine.Spy };
  let authServiceMock: { user: { user: { id: number } } };
  let saleServiceMock: { createSale: jasmine.Spy };
  let sharingDataServiceMock: { hideSearchBarEventEmitter: EventEmitter<void> };
  let directionServiceMock: { getByUserId: jasmine.Spy };
  let alertServiceMock: { success: jasmine.Spy; error: jasmine.Spy };
  let cartStoreMock: { select: jasmine.Spy; dispatch: jasmine.Spy };

  beforeEach(() => {
    const cart = new Cart();
    const product = new ProductInCart();
    product.finalProductId = 7;
    product.quantity = 2;
    product.name = 'Polera running';
    product.size = 'M';
    product.color = 'Rojo';
    cart.products = [product];

    const direction = new Direction();
    direction.directionId = 99;
    direction.city = 'Santiago';
    direction.street = 'Providencia';
    direction.number = '123';

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    authServiceMock = {
      user: { user: { id: 55 } }
    };

    saleServiceMock = {
      createSale: jasmine.createSpy('createSale').and.returnValue(of({}))
    };

    sharingDataServiceMock = {
      hideSearchBarEventEmitter: new EventEmitter<void>()
    };

    directionServiceMock = {
      getByUserId: jasmine.createSpy('getByUserId').and.returnValue(of([direction]))
    };

    alertServiceMock = {
      success: jasmine.createSpy('success').and.resolveTo(),
      error: jasmine.createSpy('error').and.resolveTo()
    };

    cartStoreMock = {
      select: jasmine.createSpy('select').and.returnValue(of({ cart })),
      dispatch: jasmine.createSpy('dispatch')
    };

    component = new PaymentComponent(
      routerMock as never,
      authServiceMock as never,
      saleServiceMock as never,
      sharingDataServiceMock as never,
      directionServiceMock as never,
      alertServiceMock as never,
      cartStoreMock as never
    );

    component.selectedDirection = direction;
  });

  it('should create and load cart from store', () => {
    expect(component).toBeTruthy();
    expect(component.cart.products.length).toBe(1);
  });

  it('should emit hide search bar and request directions on init', () => {
    spyOn(sharingDataServiceMock.hideSearchBarEventEmitter, 'emit');
    spyOn(component, 'getDirections').and.resolveTo();

    component.ngOnInit();

    expect(sharingDataServiceMock.hideSearchBarEventEmitter.emit).toHaveBeenCalled();
    expect(component.getDirections).toHaveBeenCalledWith(55);
  });

  it('should build cart payload for payment', () => {
    const payload = component.getCartForPayment();

    expect(payload.userId).toBe(55);
    expect(payload.directionId).toBe(99);
    expect(payload.products.length).toBe(1);
    expect(payload.products[0].finalProductId).toBe(7);
    expect(payload.products[0].quantity).toBe(2);
  });

  it('should complete payment and clean cart', async () => {
    await component.onPayCart();

    expect(saleServiceMock.createSale).toHaveBeenCalled();
    expect(alertServiceMock.success).toHaveBeenCalledWith('Exito', 'Pago realizado con exito!');
    expect(cartStoreMock.dispatch).toHaveBeenCalledWith(cleanCart());
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show detailed stock error when backend responds 409', async () => {
    const backendError = {
      status: 409,
      error: { outOfStock: [7] }
    };
    saleServiceMock.createSale.and.returnValue(throwError(() => backendError));

    await component.onPayCart();

    expect(alertServiceMock.error).toHaveBeenCalled();
    const message = alertServiceMock.error.calls.mostRecent().args[1] as string;
    expect(message).toContain('No hay stock para');
    expect(message).toContain('Polera running');
    expect(message).toContain('Talla: M');
    expect(message).toContain('Color: Rojo');
  });

  it('should select direction and enable confirm button', () => {
    const direction1 = new Direction();
    direction1.directionId = 1;
    const direction2 = new Direction();
    direction2.directionId = 2;
    component.directionList = [direction1, direction2];

    const host = document.createElement('div');
    const confirmButton = document.createElement('button');
    confirmButton.id = 'confirmButton';
    confirmButton.classList.add('button--disabled');
    confirmButton.setAttribute('disabled', 'true');

    const card1 = document.createElement('div');
    card1.id = '1';
    card1.classList.add('card');

    const card2 = document.createElement('div');
    card2.id = '2';
    card2.classList.add('card');

    host.appendChild(confirmButton);
    host.appendChild(card1);
    host.appendChild(card2);
    document.body.appendChild(host);

    component.selectDirection(direction2);

    const confirmButtonNode = document.getElementById('confirmButton');
    const selectedCard = document.getElementById('2');
    const otherCard = document.getElementById('1');

    expect(component.selectedDirection.directionId).toBe(2);
    expect(confirmButtonNode?.hasAttribute('disabled')).toBeFalse();
    expect(confirmButtonNode?.classList.contains('button--disabled')).toBeFalse();
    expect(selectedCard?.classList.contains('card--selected')).toBeTrue();
    expect(otherCard?.classList.contains('card--selected')).toBeFalse();

    host.remove();
  });
});