import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit{
  user: User = new User();
  passwordRepeat: String = '';
  addres: any = {
    city:"",
    street: "",
    number: ""
  }

  constructor(private usersService: UserService, private sharingDataService: SharingDataService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.sharingDataService.hiddeSearchBarEventEmitter.emit();
    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id')|| '0');
      if(id > 0){
        console.log('INTENTA ACTUALIZAR!');
        this.usersService.findById(id).subscribe( {
          next: (userResponse)=>{
            this.user = userResponse;
            this.passwordRepeat = userResponse.password;
          },
          error: (err) => {
            if (err.status == 400) {
              console.error(err);
            }
          }
        })
      }
    })
  }

  createUser(){
    console.log(this.user);
    console.log(this.addres);
    this.sharingDataService.newUserEventEmitter.emit(this.user);
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }
  updateUser(){
    console.log('Datos actualizados: ', this.user);
    this.sharingDataService.updateUserEventEmitter.emit(this.user);
  }
}
