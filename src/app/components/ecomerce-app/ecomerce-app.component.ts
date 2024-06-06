import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartComponent } from '../cart/cart.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'ecomerce-app',
  standalone: true,
  imports: [NavbarComponent, ProductListComponent, ProductDetailComponent, 
    CartComponent, FooterComponent, LoginComponent, UserComponent],
  templateUrl: './ecomerce-app.component.html'
})
export class EcomerceAppComponent {

}
