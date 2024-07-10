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
export class NavbarComponent implements OnInit, OnChanges{
  @Input() contentHeight!: number;
  @Input() contentWidth!: number;
  @ViewChild('cartNode') cartNode!: ElementRef;
  @ViewChild('menuNode') menuNode!: ElementRef;
  cart!: Cart;
  showMenu: boolean = true;
  showCart: boolean = false;
  showSessionHandler: boolean = false;
  username!: String;
  categoryListToFilter: Category[] = [];
  showAdminPanel: boolean = false;
  
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
                private sharingDataService: SharingDataService,
                private renderer: Renderer2,
                private router: Router,
                private cartStore: Store<{carts: any}>){
                  this.cartStore.select('carts').subscribe(response =>{
                    this.cart = response.cart;
                  })               
                }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contentHeight']) {
      const cartNode= this.cartNode.nativeElement;
      const menuNode = this.menuNode.nativeElement;
      this.renderer.setStyle(cartNode, 'min-height', `${this.contentHeight}px`);
      if(this.contentWidth < 768){
        this.renderer.setStyle(menuNode, 'height', `${this.contentHeight}px`);
      }
    }
  }
  ngOnInit(): void {
    this.menu();
    this.sessionHandler();
    this.closeCart();
    this.sharingDataService.showSearchBarEventEmitter.subscribe(()=> this.showSearhBar())
    this.sharingDataService.hiddeSearchBarEventEmitter.subscribe(()=>this.hiddenSearchBar())
  }

  adminPanel(){
    this.showAdminPanel = true;
    this.categoryList = [];
    this.categoryList = [
      {
        categoryName: new Category(0,'Administracion de productos'),
        subCategoryList: [new Category(0,'Ver productos'),new Category(1,'Agregar productos')]
      },
      {
        categoryName: new Category(1,'Administracion de usuarios'),
        subCategoryList: [new Category(0,'Ver usuarios'),new Category(1,'Modificar usuarios'),new Category(2,'Crear administrador')]
      },
      {
        categoryName: new Category(2,'Administracion de ventas'),
        subCategoryList: [new Category(0,'Ver ventas'),new Category(1,'Modificar ventas')]
      },
    ]
  }

  adminPanelNavigate(category: Category, subCategory: Category){
    if(category.category_id == 0 && subCategory.category_id == 1){
      this.router.navigate([`/admin_panel/${category.category_id}/${subCategory.category_id}`, 0]);
    }else{
      this.router.navigate([`/admin_panel/${category.category_id}/${subCategory.category_id}`]);
    }
  }

  
  showSearhBar(){
    let navbarContentNode = document.getElementById('navbarContent');
    let searchBarNode = document.getElementById('searchBar');
    let userBarMpde = document.getElementById('userBar');
    let logoBarNode = document.getElementById('logoBar');
    navbarContentNode?.classList.remove('h-20');
    navbarContentNode?.classList.add('h-36');
    logoBarNode?.classList.add('h-20');
    userBarMpde?.classList.add('h-20');
    searchBarNode?.classList.remove('hidden');
  }
  hiddenSearchBar(){
    let navbarContentNode = document.getElementById('navbarContent');
    let searchBarNode = document.getElementById('searchBar');
    let userBarMpde = document.getElementById('userBar');
    let logoBarNode = document.getElementById('logoBar');

    navbarContentNode?.classList.remove('h-36');
    navbarContentNode?.classList.add('h-20');
    logoBarNode?.classList.remove('h-20');
    userBarMpde?.classList.remove('h-20');
    searchBarNode?.classList.add('hidden');

  }

  

  closeCart(){
    this.sharingDataService.closeCartEventEmitter.subscribe(()=>{
      this.showHiddenCart();
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
    if(this.showCart == true){
      this.showHiddenCart();
    }
    let menu= document.getElementById('menuNode');
    this.showMenu === true ?  (this.showMenu=false,
                                menu?.classList.remove('left-[0px]')):
                              (this.showMenu=true, 
                                menu?.classList.add('left-[0px]'));
    
  }
  showHiddenCart(){
    if(this.showMenu == true){
      this.menu();
    }
    let cart= document.getElementById('cartNode');
    this.showCart === true ?  (this.showCart=false,
                                cart?.classList.remove('left-[0px]')):
                              (this.showCart=true, 
                                cart?.classList.add('left-[0px]'));
    
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
  navigateLogin(){
    if(this.showCart == true){
      this.showHiddenCart();
    }
    if(this.showMenu == true){
      this.menu();
    }
    this.router.navigate(['/login']);
    this.hiddenSearchBar();
  }
}
