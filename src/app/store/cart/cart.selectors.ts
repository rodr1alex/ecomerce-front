import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Cart } from '../../models/general.model';


export interface CartState {
  cart: Cart;
}

export const selectCartFeature = createFeatureSelector<CartState>('carts');

export const selectCart = createSelector(
  selectCartFeature,
  (state: CartState) => state.cart
);

export const selectCartProducts = createSelector(
  selectCart,
  (cart: Cart) => cart.products
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart: Cart) => cart.total
);

export const selectItemsNumber = createSelector(
  selectCart,
  (cart: Cart) => cart.itemsNumber
);

export const selectIsCartEmpty = createSelector(
  selectItemsNumber,
  (count) => count === 0
);