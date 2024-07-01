import { createAction, props } from "@ngrx/store";
import { OrderedProduct } from "../models/ordered-product.model";
import { Cart } from "../models/cart.model";


export const putCart = createAction('putCart', props<{cart: Cart}>());
export const findProduct = createAction('findProduct', props<{ordered_product_id: number}>());
export const updateCart = createAction('updateCart', props<{cartUpdated: Cart}>())

// export const addProduct = createAction('addProduct', props<{cartUpdated: Cart,orderedProductNew: OrderedProduct}>())
// export const updateProduct = createAction('updateProduct', props<{cartUpdated: Cart, orderedProductUpdated: OrderedProduct}>())
// export const removeProduct = createAction('removeProduct', props<{cartUpdated: Cart, ordered_product_id: number}>());
// export const cleanCart = createAction('cleanCart', props<{cartUpdated: Cart}>());





// export const add = createAction('add', props<{baseProductNew: BaseProduct}>());
// export const update = createAction('update', props<{baseProductUpdated: BaseProduct}>());
// export const remove = createAction('remove', props<{base_product_id: number}>());