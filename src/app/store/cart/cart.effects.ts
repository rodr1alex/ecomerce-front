import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { addProduct, cleanCart, decreaseProductQuantity, increaseProductQuantity, removeProduct } from './cart.action';
import { selectCart } from './cart.selectors';

@Injectable()
export class CartEffects {

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  persistCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProduct, increaseProductQuantity, decreaseProductQuantity, removeProduct, cleanCart),
      withLatestFrom(this.store.select(selectCart)),
      tap(([action, cart]) => {
        localStorage.setItem('cart_storage', JSON.stringify(cart));
      })
    ),
    { dispatch: false }
  );
}