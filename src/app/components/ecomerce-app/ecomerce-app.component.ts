import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'ecomerce-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ProductListComponent, ProductDetailComponent, 
    CartComponent, FooterComponent, LoginComponent, UserComponent, HomeComponent],
  templateUrl: './ecomerce-app.component.html'
})
export class EcomerceAppComponent implements OnInit{

  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private userService: UserService,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private directionService: DirectionService) {
    
  }


  ngOnInit(): void {
    this.handlerLogin();
    this.pageProductsEvent();
    this.addUser();
    this.updateUser();
    this.createDirection();
    this.updateDirection();
    this.deleteDirection();
  }

  handlerLogin() {
    this.sharingDataService.handlerLoginEventEmitter.subscribe((user) => {
      this.authService.loginUser(user).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authService.getPayload(token);
          const user = { username: payload.sub };
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          };
          this.authService.token = token;
          this.authService.user = login;
          console.log("Inicio de sesion exitoso!", user);
          this.router.navigate(['/home']);
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

  pageProductsEvent(){
    this.sharingDataService.pageProductEventEmitter.subscribe(pageable =>{
      this.baseProductStore.dispatch(putAll({baseProductList: pageable.baseProductList}));
      this.baseProductStore.dispatch(setPaginator({paginator: pageable.paginator}));
    })
  }

  addUser(){
    this.sharingDataService.newUserEventEmitter.subscribe((user)=>{
      this.userService.create(user).subscribe(
        {
          next: (userCreated)=>{
            console.log('Usuario creado con exito! ', userCreated);
            userCreated.password = user.password;
            this.sharingDataService.handlerLoginEventEmitter.emit(userCreated);
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
            console.log('Usuario actualizado con exito! ', userUpdated);
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
    this.sharingDataService.createDirectionEventEmitter.subscribe((direction)=>{
      this.directionService.create(direction).subscribe(
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
          alert("Direccion actualizada con exito!")
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
            alert("Direccion eliminada con exito!");
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
