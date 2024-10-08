import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartComponent } from '../cart/cart.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { UserComponent } from '../user/user.component';
import { HomeComponent } from '../home/home.component';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { DirectionService } from '../../services/direction.service';
import { Store } from '@ngrx/store';
import { putAll, setPaginator } from '../../store/base-product.action';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { putCart, updateCart } from '../../store/cart.action';
import { OrderedProduct } from '../../models/ordered-product.model';
import { SaleService } from '../../services/sale.service';
import { Direction } from '../../models/direction.model';

@Component({
  selector: 'ecomerce-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ProductListComponent, ProductDetailComponent, 
    CartComponent, FooterComponent, LoginComponent, UserComponent, HomeComponent],
  templateUrl: './ecomerce-app.component.html'
})
export class EcomerceAppComponent implements OnInit, AfterViewInit{
  @ViewChild('dynamicHeightContainer') dynamicHeightContainer!: ElementRef;
  cart!: Cart;
  contentHeight: number = 0;
  contentWidth: number = 0;

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private cartStore: Store<{carts: any}>,
    private router: Router,
    private userService: UserService,
    private saleService: SaleService,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private directionService: DirectionService,
    private cartService: CartService) {
      this.cartStore.select('carts').subscribe(state =>{
        this.cart = {...state.cart};
      })
    }
  ngAfterViewInit(): void {
    //this.adjustHeight();
  }

  @HostListener('window:load')
  onLoad(): void {
    this.adjustHeight();
  }
  @HostListener('window:click')
  onResize(): void {
    this.adjustHeight();
    this.sharingDataService.clickEventEmitter.emit({width:this.contentWidth, height:this.contentHeight});
  }

  private adjustHeight(): void {
    if (this.dynamicHeightContainer) {
      const container = this.dynamicHeightContainer.nativeElement;
      const height = container.offsetHeight;
      const width = container.offsetWidth;
      this.contentHeight = height;
      this.contentWidth = width;
      //console.log(`Ancho: ${this.contentWidth}, alto ${this.contentHeight}`)
    }
  }


  ngOnInit(): void {
    this.adjustHeight();
    this.handlerLogin();
    this.pageProductsEvent();
    this.addUser();
    this.updateUser();
    this.createDirection();
    this.updateDirection();
    this.deleteDirection();
    this.addProductToCart();
    this.modifyProductQuantityCart();
    this.removeProductToCart();
    this.cleanCart();
    this.payCart();
    if(this.authService.authenticated()){
      console.log('ID: ', this.authService.user.user.id)
      this.cartVerify(this.authService.user.user.id);
    }
  }

  payCart(){
    this.sharingDataService.payCartEventEmitter.subscribe((direction: Direction)=>{
      this.saleService.createSale(this.cart.cart_id, direction, this.authService.user.user.id).subscribe({
        next: response =>{
          alert('Compra realizada con éxito:');
          this.cartVerify(1);
          this.router.navigate(['/home']);
        }
      });
    })
  }

  addProductToCart(){
    this.sharingDataService.addProductToCartEventEmitter.subscribe((orderedProduct)=>{
      let cartUpdated: any;
      if(this.cart.orderedProductList !=null){
        cartUpdated = {
          ...this.cart,
          orderedProductList: [...this.cart.orderedProductList] || [] 
        };
      }else{
        cartUpdated = {
          ...this.cart,
          orderedProductList: [] 
        };
      }
      cartUpdated.orderedProductList.push(orderedProduct)
      cartUpdated.items += orderedProduct.quantity;
      cartUpdated.total += (orderedProduct.quantity * orderedProduct.finalProduct.final_price);
      this.cartStore.dispatch(updateCart({cartUpdated}));
      this.cartService.addProduct(cartUpdated.cart_id, orderedProduct).subscribe({
        next: response => {
          //console.log('Producto agregado con exito, carrito: ', response);
        }
      });
    })
  }

  modifyProductQuantityCart(){
    this.sharingDataService.modifyProductQuantityCartEventEmitter.subscribe(({diferential, orderedProduct})=>{
      let cartUpdated = {
        ...this.cart,
        orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) // Clonar deep copy de los objetos en orderedProductList
      };
      //console.log('Antes de agregar/quitar: ', cartUpdated);
      cartUpdated.items += diferential;
      cartUpdated.total += orderedProduct.finalProduct.final_price * diferential;
      cartUpdated.orderedProductList.map(item => item.ordered_product_id === orderedProduct.ordered_product_id ? item.quantity += diferential : item);
      const orderedProductCopy = cartUpdated.orderedProductList.find(item => item.ordered_product_id === orderedProduct.ordered_product_id) || new OrderedProduct();
      //console.log('Despues de agregar/quitar: ', cartUpdated);
      this.cartStore.dispatch(updateCart({cartUpdated}));
      this.cartService.updateProductQuantity(this.cart.cart_id,orderedProductCopy).subscribe({
        next: response => {
          //console.log('Producto modificado en DB con exito, carrito: ', response);
        }
      });
    })
  }

  removeProductToCart(){
    this.sharingDataService.removeProductCartEventEmitter.subscribe((orderedProduct) =>{
      let cartUpdated = {
        ...this.cart,
        orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) // Clonar deep copy de los objetos en orderedProductList
      };
      cartUpdated.items -= orderedProduct.quantity;
      cartUpdated.total -= (orderedProduct.quantity * orderedProduct.finalProduct.final_price);
      cartUpdated.orderedProductList = cartUpdated.orderedProductList.filter(item => item.ordered_product_id != orderedProduct.ordered_product_id);
      this.cartStore.dispatch(updateCart({cartUpdated}));
      this.cartService.removeProduct(this.cart.cart_id, orderedProduct.finalProduct.final_product_id).subscribe({
        next: response => {
          //console.log('Producto eliminado con exito, carrito: ', response);
        }
      });
    })
  }

  cleanCart(){
    this.sharingDataService.cleanCartEventEmitter.subscribe(()=>{
      let cartUpdated = {
        ...this.cart,
        orderedProductList: this.cart.orderedProductList.map(item => ({ ...item })) // Clonar deep copy de los objetos en orderedProductList
      };
      //console.log('Antes de agregar/quitar: ', cartUpdated);
      cartUpdated.items = 0;
      cartUpdated.total = 0;
      cartUpdated.orderedProductList = [];
      //console.log('Despues de agregar/quitar: ', cartUpdated);
      this.cartStore.dispatch(updateCart({cartUpdated}));
      this.cartService.cleanCart(this.cart.cart_id).subscribe({
        next: response => {
          //console.log('Carrito limpiado con exito, carrito: ', response);
        }
      });
    })
  }
  
  handlerLogin() {
    this.sharingDataService.handlerLoginEventEmitter.subscribe((user) => {
      this.authService.loginUser(user).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authService.getPayload(token);
          const id = payload.user_id;
          const user = { username: payload.sub, id};
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          };
          this.authService.token = token;
          this.authService.user = login;
          console.log("Inicio de sesión exitoso!", login);
         
          //verificacion de carrito de compras
          this.cartVerify(id);
          this.router.navigate(['/home']);
          // this.router.navigate(['/home']).then(()=>{
          //   window.location.reload();
          // });
        },
        error: error => {
          if (error.status == 401) {
            alert('Error en el Login');
          } else {
            throw error;
          }
        }
      })
    })
  }

  cartVerify(id: number){
    this.userService.findById(id).subscribe({
      next: user => {
        if(user.cartList.length > 0){
          console.log('Carrito list esta definido', user.cartList)
          const cartList: Cart[] = user.cartList;
          const lastCart = cartList.pop() || new Cart();
          if(lastCart?.sale == null){
            console.log('Ya existe un carrito!', lastCart)
           
            this.cartStore.dispatch(putCart({cart: lastCart}));
          }else{
            this.cartService.create(id).subscribe({
              next: cart => {
                console.log('Carrito creado con exito!', cart);
                this.cartStore.dispatch(putCart({cart}));
               
              }
            })
          }
        }else{
          console.log('Carrito list NO esta definido')
          this.cartService.create(id).subscribe({
            next: cart => {
              console.log('Carrito creado con exito!', cart);
              this.cartStore.dispatch(putCart({cart}));
             
            }
          })
        }
        
      }
    })
  }

  pageProductsEvent(){
    this.sharingDataService.pageProductEventEmitter.subscribe(pageable =>{
      this.baseProductStore.dispatch(putAll({baseProductList: pageable.baseProductList}));
      this.baseProductStore.dispatch(setPaginator({paginator: pageable.paginator}));
    })
  }

  addUser(){
    this.sharingDataService.newUserEventEmitter.subscribe(({user, direction})=>{
      this.userService.create(user).subscribe(
        {
          next: (userCreated)=>{
            //console.log('Usuario creado con exito! ', userCreated);
            userCreated.password = user.password;
            console.log('User created: ', userCreated);
            this.sharingDataService.handlerLoginEventEmitter.emit(userCreated);
            setTimeout(()=>{
              this.directionService.create(direction, userCreated.id).subscribe(
                {
                  next: response =>{
                    console.log("Direccion agregada con exito!")
                  },
                  error: error =>{
                    throw new error;
                  }
                }
              )
            }, 2000)
          },
          error: (err) => {
            if (err.status == 400) {
              console.error(err);
            }
          }
        })
    })
  }

  updateUser(){
    this.sharingDataService.updateUserEventEmitter.subscribe((user)=>{
      this.userService.update(user).subscribe(
        {
          next: (userUpdated)=>{
            //console.log('Usuario actualizado con exito! ', userUpdated);
            this.router.navigate(['/home'])
          },
          error: (err) => {
            if (err.status == 400) {
              console.error(err);
            }
          }
        }
      )
    })
  }

  createDirection(){
    this.sharingDataService.createDirectionEventEmitter.subscribe(({direction, user_id})=>{
      this.directionService.create(direction, user_id).subscribe(
        {
          next: response =>{
            alert("Direccion agregada con exito!")
          },
          error: error =>{
            throw new error;
          }
        }
      )
    })
  }

  updateDirection(){
    this.sharingDataService.updateDirectionEventEmitter.subscribe((direction)=>{
      this.directionService.update(direction).subscribe({
        next: response =>{
          alert("Dirección actualizada con exito!")
        },
        error: error =>{
          throw new error;
        }
      })
    })
  }

  deleteDirection(){
    this.sharingDataService.deleteDirectionEventEmitter.subscribe(direction_id =>{
      this.directionService.remove(direction_id).subscribe(
        {
          next: response =>{
            alert("Dirección eliminada con exito!");
            this.router.navigate(['/home'])
          },
          error: error =>{
            throw new error;
          }
        }
      )
    })
  }

}
