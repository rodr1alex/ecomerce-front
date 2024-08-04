import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, input } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CartComponent } from '../cart/cart.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Store } from '@ngrx/store';
import { Category } from '../../models/category.model';
import { CategoryList } from '../../models/category-list.model';
import { updateCart } from '../../store/cart.action';
import { flatMap } from 'rxjs';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, LoginComponent, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  @ViewChild('cartNode') cartNode!: ElementRef;
  @ViewChild('menuNode') menuNode!: ElementRef;
  cart!: Cart;
  isMenuVisible: boolean = true;
  isCartVisible: boolean = false;
  isSessionHandlerVisible: boolean = false;
  isAdminPanelVisible: boolean = false;
  categoryListToFilter: Category[] = [];
  clickInLogin: boolean = false;
  categoryList: CategoryList[] = [];
  
  
  constructor(  private authService: AuthService, 
                private sharingDataService: SharingDataService,
                private renderer: Renderer2,
                private router: Router,
                private cartStore: Store<{carts: any}>){
                  this.cartStore.select('carts').subscribe(response =>{
                    this.cart = response.cart;
                  })               
                }

 
  ngOnInit(): void {
    this.clickHandler();
    this.setCategoryList();
    this.menuVisibilityToggle();
    this.sessionHandlerVisibilityToggle();
    this.hideCart();
    this.sharingDataService.showSearchBarEventEmitter.subscribe(()=> this.showSearchBar())
    this.sharingDataService.hideSearchBarEventEmitter.subscribe(()=>this.hideSearchBar())
  }

  clickHandler(){
    this.sharingDataService.clickEventEmitter.subscribe(({width, height})=>{
      if(width < 768){
       const heightToApply = height - (80 + 115);
       const cartNode= this.cartNode.nativeElement;
       const menuNode = this.menuNode.nativeElement;
       this.renderer.setStyle(cartNode, 'min-height', `${heightToApply}px`);
       this.renderer.setStyle(menuNode, 'height', `${heightToApply}px`);
      }else{
        if(this.clickInLogin){
          const node = document.getElementById('userLogin');
          node?.classList.remove('hidden');
          this.clickInLogin = false
        }else{
          const node = document.getElementById('userLogin');
          node?.classList.add('hidden');
        }
      }
    })
  }

  setCategoryList(){
    this.isAdminPanelVisible ? 
    (
      this.categoryList = [
        {
          categoryName: new Category(0,'Administración de productos'),
          subCategoryList: []
        },
        {
          categoryName: new Category(1,'Administración de ventas'),
          subCategoryList: []
        },
        {
          categoryName: new Category(2,'Administración de usuarios'),
          subCategoryList: []
        },
      ]
    ):
    (
      this.categoryList =  [
        {
          categoryName: new Category(1,'Running'),
          subCategoryList: [new Category(7,'Calzado'),new Category(6,'Ropa'),new Category(8,'Elementos de protección'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(2,'Ciclismo'),
          subCategoryList: [new Category(5,'Bicicletas'),new Category(6,'Ropa'),new Category(8,'Elementos de protección'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(3,'Natación'),
          subCategoryList: [new Category(9,'Trajes de neopreno'),new Category(8,'Elementos de protección'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(4,'Accesorios'),
          subCategoryList: [new Category(1,'Running'), new Category(2,'Ciclismo'), new Category(3,'Natación'), new Category(13,'Nutrición')]
        },
      ]
    );
  }

  menuVisibilityToggle(){
    this.isCartVisible && this.cartVisibilityToggle();
    const menu= document.getElementById('menuNode');
    this.isMenuVisible ?
      (this.isMenuVisible = false, menu?.classList.remove('left-[0px]')):
      (this.isMenuVisible = true, menu?.classList.add('left-[0px]'));
  }

  sessionHandlerVisibilityToggle(){
    const sessionHandler = document.getElementById('sessionHandler');
    this.isSessionHandlerVisible?
      (this.isSessionHandlerVisible = false, sessionHandler?.classList.remove('hidden')):
      (this.isSessionHandlerVisible = true, sessionHandler?.classList.add('hidden'))
  }

  hideCart(){
    this.sharingDataService.closeCartEventEmitter.subscribe(()=>{
      this.cartVisibilityToggle();
    })
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
    this.isAdminPanelVisible && this.adminPanelVisibilityToggle();
    let cartUpdated = {
      ...this.cart,
      orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) 
    };
    cartUpdated.items = 0;
    cartUpdated.total = 0;
    cartUpdated.orderedProductList = [];
    this.cartStore.dispatch(updateCart({cartUpdated}));
  }

  subCategoryVisibilityToggle(id: string){
    const subCategoryNode = document.getElementById(id);
    subCategoryNode?.classList.contains('mobile-hidden') ?
      subCategoryNode?.classList.remove('mobile-hidden'):
      subCategoryNode?.classList.add('mobile-hidden')
  }

  adminPanelVisibilityToggle(){
    this.isAdminPanelVisible ? this.isAdminPanelVisible = false: this.isAdminPanelVisible = true;
    this.setCategoryList();
  }

  cartVisibilityToggle(){
    this.isMenuVisible && this.menuVisibilityToggle();
    const cart= document.getElementById('cartNode');
    this.isCartVisible ?
      (this.isCartVisible = false, cart?.classList.remove('left-[0px]')):
      (this.isCartVisible = true, cart?.classList.add('left-[0px]'));
  }

  showSearchBar(){
    let navbarContentNode = document.getElementById('navbarContent');
    let searchBarNode = document.getElementById('searchBar');
    let userBarNode = document.getElementById('userBar');
    let logoBarNode = document.getElementById('logoBar');
    navbarContentNode?.classList.remove('h-20');
    navbarContentNode?.classList.add('h-36');
    logoBarNode?.classList.add('h-20');
    userBarNode?.classList.add('h-20');
    searchBarNode?.classList.remove('hidden');
  }

  hideSearchBar(){
    let navbarContentNode = document.getElementById('navbarContent');
    let searchBarNode = document.getElementById('searchBar');
    let userBarNode = document.getElementById('userBar');
    let logoBarNode = document.getElementById('logoBar');
    navbarContentNode?.classList.remove('h-36');
    navbarContentNode?.classList.add('h-20');
    logoBarNode?.classList.remove('h-20');
    userBarNode?.classList.remove('h-20');
    searchBarNode?.classList.add('hidden');
  }

  //Funciones de navegación
  adminPanelNavigate(category: Category){
    this.router.navigate([`/admin_panel/${category.category_id}`, 0]);
  }

  filter(category: Category, subCategory: Category){
    this.router.navigate(['/product_list',category.category_id, subCategory.category_id, 0]);
  }

  navigateLogin(){
    this.isCartVisible && this.cartVisibilityToggle();
    this.isMenuVisible && this.menuVisibilityToggle();
    this.router.navigate(['/login']);
    this.hideSearchBar();
  }

  updateUserNavigate(){
    this.router.navigate(['/update_user',this.login.user.id]);
  }

  //Funciones auxiliares
  formatCurrency(value: number): string {
    value == undefined && (value = 0);
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

}
