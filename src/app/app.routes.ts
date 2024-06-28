import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { DirectionListComponent } from './components/direction-list/direction-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'cart',
        component: CartComponent,
    },
    {
        path: 'create_user',
        component: UserComponent,
    },
    {
        path: 'update_user/:id',
        component: UserComponent,
    },
    {
        path: 'update_password/:id',
        component: UpdatePasswordComponent,
    },
    {
        path: 'direction_list',
        component: DirectionListComponent,
    },
    {
        path: 'product_detail/:base_product_id',
        component: ProductDetailComponent,
    },
    {
        path: 'product_list/:page',
        component: ProductListComponent,
    },
];
