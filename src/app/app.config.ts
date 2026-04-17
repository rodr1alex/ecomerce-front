import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { cartsReducer } from './store/cart/cart.reducer';
import { provideEffects } from '@ngrx/effects';
import { CartEffects } from './store/cart/cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideEffects([CartEffects]),
    provideStore(
      {
        carts: cartsReducer
      }
    )]
};
