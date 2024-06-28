import { createReducer, on } from "@ngrx/store";
import { BaseProduct } from "../models/base-product.model";
import { putAll, setPaginator, find, add, update, remove } from "./base-product.action";



const baseProductList: BaseProduct[] = [];
const baseProduct: BaseProduct = new BaseProduct();
export const baseProductsReducer = createReducer(
    {
        baseProductList,
        paginator: {},
        baseProduct
    },
    on(putAll, (state, {baseProductList}) =>(
        {
            baseProductList: [ ...baseProductList],
            paginator:state.paginator,
            baseProduct: state.baseProduct
        }
    )),
    on(setPaginator, (state,{paginator} ) =>(
        {
            baseProductList: state.baseProductList,
            paginator: {... paginator},
            baseProduct: state.baseProduct
        }
    )),
    on(find, (state, {base_product_id}) => ({
            baseProductList: state.baseProductList,
            paginator: state.paginator,
            baseProduct: state.baseProductList.find(baseProduct => baseProduct.base_product_id == base_product_id) || new BaseProduct()
    })),
    on(add, (state, {baseProductNew}) =>(
        {
            baseProductList: [ ...state.baseProductList, {...baseProductNew}],
            paginator:state.paginator,
            baseProduct: state.baseProduct
        }
    )),
    on(update, (state, {baseProductUpdated})=>(
        {
            baseProductList: state.baseProductList.map(bp => (bp.base_product_id == baseProductUpdated.base_product_id)? {...baseProductUpdated}: bp),
            paginator:state.paginator,
            baseProduct: state.baseProduct
        }
    )),
    on(remove, (state, {base_product_id}) => (
        {
            baseProductList: state.baseProductList.filter(bp => bp.base_product_id != base_product_id),
            paginator:state.paginator,
            baseProduct: state.baseProduct
        }
    ))

)