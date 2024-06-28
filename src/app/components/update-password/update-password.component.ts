import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'update-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent implements OnInit{
  userOld: User = new User;
  userNew: User = new User;
  passwordRepeat: String = '';
  
  constructor(private sharingDataService: SharingDataService, 
              private userService: UserService, 
              private route: ActivatedRoute, 
              private router: Router,
              private authService: AuthService
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id')|| '0');
      this.userNew.id = id;
    })
    this.userOld.username = this.authService.user.user.username;
  }

  onClear(userForm: NgForm): void {
    this.userNew = new User();
    this.userOld = new User();
    userForm.reset();
    userForm.resetForm();
  }
  updatePassword(){
    console.log("userOld: ", this.userOld);
    console.log("userNew: ", this.userNew);
    //comprobar que contrasenia actual es correcta
    this.authService.loginUser(this.userOld).subscribe(
      {
        next: response => {
          this.userService.updatePassword(this.userNew).subscribe({
            next: response => {
              alert('Contrasenia actualizada con exito');
              this.router.navigate(['/home'])
            },
            error: error =>{
              throw error;
            }
          });
        },
        error: error => {
          if (error.status == 401) {
            alert('Contrasena actual equivocada');
          } else {
            throw error;
          }
        }
      }
    )
    //conectarse con userService y actualizar contrasenia
  }

  

}
