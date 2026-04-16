import { createAction, props } from "@ngrx/store";
import { ProductInCart } from "../../models/general.model";



export const addProduct = createAction('addProduct', props<{product: ProductInCart}>())
export const increaseProductQuantity = createAction('increaseProductQuantity', props<{finalProductId: Number}>())
export const decreaseProductQuantity = createAction('addPdecreaseProductQuantityroduct', props<{finalProductId: Number}>())
export const removeProduct = createAction('removeProduct', props<{product: ProductInCart}>())
export const cleanCart = createAction('cleanCart');

