import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { baseProductsReducer } from './store/base-product.reducer';
import { cartsReducer } from './store/cart.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore(
      {
        baseProducts: baseProductsReducer,
        carts: cartsReducer
      }
    )]
};
