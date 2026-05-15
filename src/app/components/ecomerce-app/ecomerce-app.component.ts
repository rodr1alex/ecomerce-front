import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'ecomerce-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './ecomerce-app.component.html'
})
export class EcomerceAppComponent implements OnInit{
  @ViewChild('dynamicHeightContainer') dynamicHeightContainer!: ElementRef;
  contentHeight: number = 0;
  contentWidth: number = 0;

  constructor(
    private router: Router,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private toastService: ToastService) {}


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
    }
  }


  ngOnInit(): void {
    this.adjustHeight();
    this.handlerLogin();

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
          this.toastService.success('Inicio de sesión exitoso!');
          this.router.navigate(['/home']);
        },
        error: error => {
          if (error.status == 401) {
            
          } else {
            this.toastService.error('Error en el Login');
            throw error;
          }
        }
      })
    })
  }






}
