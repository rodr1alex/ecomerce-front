import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Direction } from '../../models/direction.model';

@Component({
  selector: 'user',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit{
  user: User = new User();
  showDirection: boolean = false;
  passwordRepeat: String = '';
  addres: Direction = new Direction()
  isAdmin: boolean = false;


  constructor(
    private userService: UserService, 
    private sharingDataService: SharingDataService, 
    private route: ActivatedRoute,
    private authService: AuthService){}

  
  ngOnInit(): void {
    this.sharingDataService.hideSearchBarEventEmitter.emit();
    const id: number = +(this.route.snapshot.paramMap.get('id') || '0')
    if(id > 0) this.getUser(id)
    this.isAdmin = this.authService.user.isAdmin
  }

  async getUser(user_id: number){
    try {
      const res = await firstValueFrom(this.userService.findById(user_id))
      this.user = res
      this.passwordRepeat = res.password
    } catch (error) {
      console.error('erro en getUser', error)
    }
  }

  async createUser(){
    this.user.directionList = (this.showDirection) ? [this.addres] : []
    
    try {
      const res = await firstValueFrom(this.userService.create(this.user))
    } catch (error) {
      console.error('error en createUser', error)
    }
  }

  async updateUser(){
    try {
      const res = await firstValueFrom(this.userService.update(this.user))
    } catch (error) { 
        console.error('error en updateUser', error)
    }
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

  toggleDirectionForm(){
    this.showDirection = !this.showDirection;
  }


}
