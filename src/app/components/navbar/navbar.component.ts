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
  clickInLogin: boolean = false;
  
  categoryList: CategoryList[] = [
    {
      categoryName: new Category(1,'Running'),
      subCategoryList: [new Category(7,'Calzado'),new Category(6,'Ropa'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
    },
    {
      categoryName: new Category(2,'Ciclismo'),
      subCategoryList: [new Category(5,'Bicicletas'),new Category(6,'Ropa'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
    },
    {
      categoryName: new Category(3,'Natacion'),
      subCategoryList: [new Category(9,'Trajes de neopreno'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
    },
    {
      categoryName: new Category(4,'Accesorios'),
      subCategoryList: [new Category(1,'Running'), new Category(2,'Ciclismo'), new Category(3,'Natacion'), new Category(13,'Nutricion')]
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
    this.clickHanddler();
    this.menu();
    this.sessionHandler();
    this.closeCart();
    this.sharingDataService.showSearchBarEventEmitter.subscribe(()=> this.showSearhBar())
    this.sharingDataService.hiddeSearchBarEventEmitter.subscribe(()=>this.hiddenSearchBar())
  }

  clickHanddler(){
    this.sharingDataService.clickrEventEmitter.subscribe(({width, height})=>{
      if(width > 768){
        if(this.clickInLogin){
          //console.log('Click in login');
          const node = document.getElementById('userLogin');
          node?.classList.remove('hidden');
          this.clickInLogin = false
        }else{
          //console.log('Click fuera del login')
          const node = document.getElementById('userLogin');
          node?.classList.add('hidden');
        }
      }
    })
  }
  adminPanel(){
    this.showAdminPanel == true? this.showAdminPanel = false: this.showAdminPanel = true;
    
    this.showAdminPanel == true ? 
    (
      this.categoryList = [
        {
          categoryName: new Category(0,'Administracion de productos'),
          subCategoryList: []
        },
        {
          categoryName: new Category(1,'Administracion de ventas'),
          subCategoryList: []
        },
        {
          categoryName: new Category(2,'Administracion de usuarios'),
          subCategoryList: []
        },
      ]
    ):
    (
      this.categoryList =  [
        {
          categoryName: new Category(1,'Running'),
          subCategoryList: [new Category(7,'Calzado'),new Category(6,'Ropa'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(2,'Ciclismo'),
          subCategoryList: [new Category(5,'Bicicletas'),new Category(6,'Ropa'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(3,'Natacion'),
          subCategoryList: [new Category(9,'Trajes de neopreno'),new Category(8,'Elementos de proteccion'), new Category(4,'Accesorios')]
        },
        {
          categoryName: new Category(4,'Accesorios'),
          subCategoryList: [new Category(1,'Running'), new Category(2,'Ciclismo'), new Category(3,'Natacion'), new Category(13,'Nutricion')]
        },
      ]
    );
    
  }

  adminPanelNavigate(category: Category){
    this.router.navigate([`/admin_panel/${category.category_id}`, 0]);
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
    if(this.showAdminPanel){
      this.adminPanel();
    }
    

    //TRATAR DE OPTIMIZAR,CREAR ACCIO PARA LIMPIAR CARRITO
    let cartUpdated = {
      ...this.cart,
      orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) 
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
