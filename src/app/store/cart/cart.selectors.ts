import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartV2 } from '../../models/general.model';


export interface CartState {
  cart: CartV2;
}

export const selectCartFeature = createFeatureSelector<CartState>('carts');

export const selectCart = createSelector(
  selectCartFeature,
  (state: CartState) => state.cart
);

export const selectCartProducts = createSelector(
  selectCart,
  (cart: CartV2) => cart.products
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart: CartV2) => cart.total
);

export const selectItemsNumber = createSelector(
  selectCart,
  (cart: CartV2) => cart.itemsNumber
);

export const selectIsCartEmpty = createSelector(
  selectItemsNumber,
  (count) => count === 0
);