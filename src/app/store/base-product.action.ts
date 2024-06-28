import { createAction, props } from "@ngrx/store";
import { BaseProduct } from "../models/base-product.model";


export const putAll = createAction('putAll', props<{baseProductList: BaseProduct[]}>());
export const setPaginator = createAction('setPaginator', props<{paginator: any}>());
export const find = createAction('find', props<{base_product_id: number}>());

export const add = createAction('add', props<{baseProductNew: BaseProduct}>());
export const update = createAction('update', props<{baseProductUpdated: BaseProduct}>());
export const remove = createAction('remove', props<{base_product_id: number}>());