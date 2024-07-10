import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { DirectionListComponent } from './components/direction-list/direction-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { ViewProductComponent } from './components/admin/view-product/view-product.component';
import { ModidyProductComponent } from './components/admin/modidy-product/modidy-product.component';
import { ProductComponent } from './components/admin/product/product.component';

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
        path: 'product_list/:category/:subcategory/:page',
        component: ProductListComponent,
    },
    {
        path: 'payment',
        component: PaymentComponent,
    },
    {
        path: 'admin_panel/0/0',
        component: ViewProductComponent,
    },
    {
        path: 'admin_panel/0/1/:base_product_id',
        component: ProductComponent,
    },
    
];
