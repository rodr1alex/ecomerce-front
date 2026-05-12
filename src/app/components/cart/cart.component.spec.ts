/// <reference types="jasmine" />

import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { CartComponent } from './cart.component';
import { Cart, ProductInCart } from '../../models/general.model';
import {
  cleanCart,
  decreaseProductQuantity,
  increaseProductQuantity,
  removeProduct
} from '../../store/cart/cart.action';

describe('CartComponent', () => {
  let component: CartComponent;
  let routerMock: { navigate: jasmine.Spy };
  let sharingDataServiceMock: { closeCartEventEmitter: EventEmitter<void> };
  let cartStoreMock: { select: jasmine.Spy; dispatch: jasmine.Spy };
  let alertServiceMock: { confirm: jasmine.Spy };
  let productInCart: ProductInCart;

  beforeEach(() => {
    const cart = new Cart();
    cart.total = 30000;
    cart.itemsNumber = 2;

    productInCart = new ProductInCart();
    productInCart.finalProductId = 10;
    productInCart.baseProductId = 99;
    productInCart.quantity = 2;
    productInCart.name = 'Zapatilla de trail para montaña y senderos';
    productInCart.price = 15000;

    cart.products = [productInCart];

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    sharingDataServiceMock = {
      closeCartEventEmitter: new EventEmitter<void>()
    };

    cartStoreMock = {
      select: jasmine.createSpy('select').and.returnValue(of({ cart })),
      dispatch: jasmine.createSpy('dispatch')
    };

    alertServiceMock = {
      confirm: jasmine.createSpy('confirm').and.callFake((_config: unknown, onConfirm: () => void) => onConfirm())
    };

    component = new CartComponent(
      routerMock as never,
      sharingDataServiceMock as never,
      cartStoreMock as never,
      alertServiceMock as never
    );
  });

  it('should create and load cart from store', () => {
    expect(component).toBeTruthy();
    expect(component.cart.itemsNumber).toBe(2);
    expect(component.cart.total).toBe(30000);
  });

  it('should dispatch increase and decrease actions', () => {
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;

    component.increase(event, productInCart);
    component.decrease(event, productInCart);

    expect(cartStoreMock.dispatch).toHaveBeenCalledWith(increaseProductQuantity({ finalProductId: 10 }));
    expect(cartStoreMock.dispatch).toHaveBeenCalledWith(decreaseProductQuantity({ finalProductId: 10 }));
    expect((event as unknown as { stopPropagation: jasmine.Spy }).stopPropagation).toHaveBeenCalledTimes(2);
  });

  it('should not decrease when quantity is zero', () => {
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;
    const product = new ProductInCart();
    product.finalProductId = 11;
    product.quantity = 0;

    component.decrease(event, product);

    expect(cartStoreMock.dispatch).not.toHaveBeenCalled();
    expect((event as unknown as { stopPropagation: jasmine.Spy }).stopPropagation).not.toHaveBeenCalled();
  });

  it('should dispatch remove action', () => {
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;

    component.remove(event, productInCart);

    expect(cartStoreMock.dispatch).toHaveBeenCalledWith(removeProduct({ product: productInCart }));
  });

  it('should confirm and clean cart', () => {
    component.cleanCart();

    expect(alertServiceMock.confirm).toHaveBeenCalled();
    expect(cartStoreMock.dispatch).toHaveBeenCalledWith(cleanCart());
  });

  it('should close cart and navigate to product detail', () => {
    spyOn(sharingDataServiceMock.closeCartEventEmitter, 'emit');

    component.close();
    component.detailProduct(productInCart);

    expect(sharingDataServiceMock.closeCartEventEmitter.emit).toHaveBeenCalledTimes(2);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product_detail/', productInCart.baseProductId]);
  });

  it('should format short description and currency', () => {
    const longText = '1234567890123456789012345678901234567890';

    expect(component.getShortDescription(undefined as unknown as string)).toBe('');
    expect(component.getShortDescription(longText)).toBe('12345678901234567890123456789012345...');
    expect(component.formatCurrency(20000)).toContain('$');
  });
});