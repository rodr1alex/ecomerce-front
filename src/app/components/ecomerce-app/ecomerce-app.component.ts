import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';


@Component({
  selector: 'ecomerce-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './ecomerce-app.component.html'
})
export class EcomerceAppComponent implements OnInit, AfterViewInit{
  @ViewChild('dynamicHeightContainer') dynamicHeightContainer!: ElementRef;
  contentHeight: number = 0;
  contentWidth: number = 0;

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private cartStore: Store<{carts: any}>,
    private router: Router,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {}

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

    if(this.authService.authenticated()){
      console.log('ID: ', this.authService.user.user.id)
      this.cartVerify(this.authService.user.user.id);
    }
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
    // this.userService.findById(id).subscribe({
    //   next: user => {
    //     if(user.cartList.length > 0){
    //       console.log('Carrito list esta definido', user.cartList)
    //       const cartList: Cart[] = user.cartList;
    //       const lastCart = cartList.pop() || new Cart();
    //       if(lastCart?.sale == null){
    //         console.log('Ya existe un carrito!', lastCart)
           
    //         this.cartStore.dispatch(putCart({cart: lastCart}));
    //       }else{
    //         this.cartService.create(id).subscribe({
    //           next: cart => {
    //             console.log('Carrito creado con exito!', cart);
    //             this.cartStore.dispatch(putCart({cart}));
               
    //           }
    //         })
    //       }
    //     }else{
    //       console.log('Carrito list NO esta definido')
    //       this.cartService.create(id).subscribe({
    //         next: cart => {
    //           console.log('Carrito creado con exito!', cart);
    //           this.cartStore.dispatch(putCart({cart}));
             
    //         }
    //       })
    //     }
        
    //   }
    // })
  }





}
