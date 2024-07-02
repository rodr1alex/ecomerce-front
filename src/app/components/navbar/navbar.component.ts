import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CartComponent } from '../cart/cart.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Store } from '@ngrx/store';
import { Category } from '../../models/category.model';
import { CategoryList } from '../../models/category-list.model';
import { updateCart } from '../../store/cart.action';

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
  categoryListToFilter: Category[] = [];
  
  categoryList: CategoryList[] = [
    {
      categoryName: new Category(6,'hombre'),
      subCategoryList: [new Category(4,'Calzado'),new Category(8,'Ropa'),new Category(9,'Accesorios')]
    },
    {
      categoryName: new Category(7,'Mujer'),
      subCategoryList: [new Category(4,'Calzado'),new Category(8,'Ropa'),new Category(9,'Accesorios')]
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

    //TRATAR DE OPTIMIZAR,CREAR ACCIO PARA LIMPIAR CARRITO
    let cartUpdated = {
      ...this.cart,
      orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) // Clonar deep copy de los objetos en orderedProductList
    };
    cartUpdated.items = 0;
    cartUpdated.total = 0;
    cartUpdated.orderedProductList = [];
    this.cartStore.dispatch(updateCart({cartUpdated}));

  }

  menu(){
    let menu= document.getElementById('menu');
    this.showMenu === true ?  (this.showMenu=false,
                                menu?.classList.remove('left-[0px]')):
                              (this.showMenu=true, 
                                menu?.classList.add('left-[0px]'));
    
  }
  filter(category: Category, subCategory: Category){
    this.router.navigate(['/product_list',category.category_id, subCategory.category_id, 0] );
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
