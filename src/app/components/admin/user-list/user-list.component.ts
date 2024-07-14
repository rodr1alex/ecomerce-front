import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, RouterModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit{
userList: User[] = [];
paginator!: any;
url: string = '/admin_panel/1/0';
pageSizeList: number[] = [5,10,20,50,100,200,500];
selectedPageSize: string = '20';
roleList: any []  =[{'id':'1','roleName':'User'}, {'id':'2','roleName':'Admin'}];
selectedRoleId: string = '';

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private userService: UserService
){

}
  ngOnInit(): void {
    this.filter();
  }

  filter(){
    const role = new Role();
    role.id = +this.selectedRoleId;
    this.route.paramMap.subscribe(params => {
      const page = +(params.get('page') || '0');
      this.userService.filter(role, +this.selectedPageSize, page).subscribe({
        next: response =>{
          this.paginator = response;
          this.userList = response.content;
        }
      })
    })
  }

  onChange(event: Event){
    this.filter();
  }

  removeTypeUserFilter(){
    this.selectedRoleId = '';
    this.filter();
  }

 
  

}
