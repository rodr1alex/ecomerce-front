import { createReducer, on } from "@ngrx/store";
import { addProduct, cleanCart, decreaseProductQuantity,  increaseProductQuantity,  removeProduct,  } from "./cart.action";
import { CartV2, ProductInCart } from "../../models/general.model";


const getInitialCartState = (): { cart: CartV2 } => {
  const savedCart = localStorage.getItem('cart_storage');
  
  if (savedCart) {
    try {
      return { cart: JSON.parse(savedCart) };
    } catch (e) {
      console.error("Error cargando el carrito del localStorage", e);
    }
  }

  const defaultCart = new CartV2();
  defaultCart.total = 0;
  defaultCart.itemsNumber = 0;
  defaultCart.products = [];
  
  return { cart: defaultCart };
};

export const initialState = getInitialCartState();

export const cartsReducer = createReducer(
    initialState,
    on(addProduct, (state, { product }) => {
        const existingProduct: ProductInCart | undefined = state.cart.products.find(p => p.finalProductId === product.finalProductId)
        let newProducts: ProductInCart[]
        if (existingProduct) {
            newProducts = state.cart.products.map(p => p.finalProductId === product.finalProductId ? { ...p, quantity: p.quantity + product.quantity } : p)
        } else {
            newProducts = [...state.cart.products, product]
        }

        return {
            ...state,
            cart: {
                ...state.cart,
                total: state.cart.total + (product.quantity * product.price),
                itemsNumber: state.cart.itemsNumber + product.quantity,
                products: newProducts
            }
        }
    }),
    on(increaseProductQuantity, (state, { finalProductId }) => {
        const existingProduct: ProductInCart | undefined = state.cart.products.find(p => p.finalProductId === finalProductId)
        let actualProducts = state.cart.products.map(p => p.finalProductId === finalProductId ? { ...p, quantity: p.quantity + 1 } : p)
        return (

            {
                ...state,
                cart: {
                    ...state.cart,
                    total: state.cart.total + existingProduct!.price,
                    itemsNumber: state.cart.itemsNumber + 1,
                    products: actualProducts
                }
            }
        )
    }),
    on(decreaseProductQuantity, (state, { finalProductId }) => {

        const existingProduct: ProductInCart | undefined = state.cart.products.find(p => p.finalProductId === finalProductId)
        if(existingProduct?.quantity == 0) return {... state}

        let actualProducts = state.cart.products.map(p => p.finalProductId === finalProductId ? { ...p, quantity: p.quantity - 1 } : p)
        return (

            {
                ...state,
                cart: {
                    ...state.cart,
                    total: state.cart.total - existingProduct!.price,
                    itemsNumber: state.cart.itemsNumber - 1,
                    products: actualProducts
                }
            }
        )
    }),
    on(removeProduct, (state, { product }) => (
        {
            cart:
            {
                ...state.cart,
                products: state.cart.products.filter(p => p.finalProductId !== product.finalProductId),
                total: state.cart.total - (product.quantity * product.price),
                itemsNumber: state.cart.itemsNumber - product.quantity
            },

        }
    )),
    on(cleanCart, (state) => (
        {
            cart:
            {
                ...state.cart,
                total: 0,
                itemsNumber: 0,
                products: [],
            },

        }
    ))
)
