import { createReducer, on } from "@ngrx/store";
import { OrderedProduct } from "../models/ordered-product.model";
import {  addProduct, findProduct, putCart, removeProduct, updateCart } from "./cart.action";
import { Cart } from "../models/cart.model";
import { CartV2, ProductInCart } from "../models/products-general.model";


// export const putAllproducts = createAction('putAllproducts', props<{orderedProductList: OrderedProduct[]}>());
// export const findProduct = createAction('findProduct', props<{ordered_product_id: number}>());

// export const addProduct = createAction('addProduct', props<{orderedProductNew: OrderedProduct}>())
// export const updateProduct = createAction('updateProduct', props<{orderedProductUpdated: OrderedProduct}>())
// export const removeProduct = createAction('removeProduct', props<{ordered_product_id: number}>());


// const cart: Cart = new Cart();
// const orderedProduct: OrderedProduct = new OrderedProduct();

// export const cartsReducer = createReducer(
//     {
//         cart,
//         orderedProduct
//     },
//     on(putCart, (state, {cart}) =>(
//         {
//             cart: {...cart},
//             orderedProduct: state.orderedProduct
//         }
//     )),
//     on(findProduct, (state, {final_product_id}) =>(
//         {
//             cart: state.cart,
//             orderedProduct: state.cart.orderedProductList.find(orderedProduct => orderedProduct.finalProduct.final_product_id === final_product_id) || new OrderedProduct()
//         }
//     )),
//     on(updateCart, (state, {cartUpdated}) =>(
//         {
//             cart: {...cartUpdated},
//             orderedProduct: state.orderedProduct
//         }
//     ))
// )



const cart: CartV2 = new CartV2();
cart.total = 0
cart.itemsNumber = 0
const productInCart: ProductInCart = new ProductInCart();

export const cartsReducer = createReducer(
    {
        cart
    },
    on(putCart, (state, {cart}) =>(
        {
            cart: {...cart},
            //orderedProduct: state.orderedProduct
        }
    )),
    on(findProduct, (state, {final_product_id}) =>(
        {
            cart: state.cart,
            //orderedProduct: state.cart.orderedProductList.find(orderedProduct => orderedProduct.finalProduct.final_product_id === final_product_id) || new OrderedProduct()
        }
    )),
    on(updateCart, (state, {cartUpdated}) =>(
        {
            cart: {...cartUpdated},
          //  orderedProduct: state.orderedProduct
        }
    )),
     on(addProduct, (state, {product}) =>(
        {
            cart: 
            {
                ...state.cart, 
                products: [...state.cart.products, product],
                total: state.cart.total + (product.quantity * product.price),
                itemsNumber: state.cart.itemsNumber + product.quantity 
            },
   
        }
    )),
     on(removeProduct, (state, {product}) =>(
        {
            cart: 
            {
                ...state.cart, 
                products: state.cart.products.filter(p => p.finalProductId !== product.finalProductId),
                total: state.cart.total - (product.quantity * product.price),
                itemsNumber: state.cart.itemsNumber - product.quantity 
            },
          
        }
    ))
)