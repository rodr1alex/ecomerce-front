import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CartComponent } from '../cart/cart.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, LoginComponent, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  cart!: Cart;
  showMenu: boolean = true;
  showSessionHandler: boolean = false;
  username!: String;
  
  categoryList: any = [
    {
      categoryName:'Hombre',
      subCategoryList: ['Calzado','Ropa','Accesorios']
    },
    {
      categoryName:'Mujer',
      subCategoryList: ['Calzado','Ropa','Accesorios']
    },
    {
      categoryName:'Deportes',
      subCategoryList: ['Running','Trekking','Trail']
    },
    {
      categoryName:'Calzado',
      subCategoryList: ['Running','Trekking','Trail']
    },
    {
      categoryName:'Ropa',
      subCategoryList: ['Poleras','Pantalones','Cortavientos']
    }, {
      categoryName:'Accesorios',
      subCategoryList: ['Suplementos','Relojes','Otros']
    },
  ]
  
  
  constructor(  private authService: AuthService, 
                private router: Router,
                private cartStore: Store<{carts: any}>){
                  this.cartStore.select('carts').subscribe(response =>{
                    this.cart = response.cart;
                  })               
                }

  ngOnInit(): void {
    this.menu();
    this.sessionHandler();
    
  }

  get login() {
    return this.authService.user;
  }

  get admin() {
    return this.authService.isAdmin();
  }

  handlerLogout() {
    this.authService.logout();
    this.router.navigate(['/home'])
  }

  menu(){
    let menu= document.getElementById('menu');
    this.showMenu === true ?  (this.showMenu=false,
                                menu?.classList.remove('left-[0px]')):
                              (this.showMenu=true, 
                                menu?.classList.add('left-[0px]'));
    
  }

  showSubCategory(id: string){
    let subCategoryNode = document.getElementById(id);
    subCategoryNode?.classList.contains('mobile-hidden') ? subCategoryNode?.classList.remove('mobile-hidden'): subCategoryNode?.classList.add('mobile-hidden')
  }
  sessionHandler(){
    let sessionHandler = document.getElementById('sessionHandler');
    this.showSessionHandler === false ?  (this.showSessionHandler = true, sessionHandler?.classList.add('hidden')):
                                        (this.showSessionHandler = false, sessionHandler?.classList.remove('hidden'))
  }
}
