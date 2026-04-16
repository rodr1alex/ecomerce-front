import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Page, UserFilter } from '../../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, RouterModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  userPaginator: Page<User> = new Page<User>();
  pageSizeList: number[] = [5, 10, 20, 50, 100, 200, 500];
  selectedPageSize: string = '20';
  roleList: any[] = [{ 'id': '1', 'roleName': 'User' }, { 'id': '2', 'roleName': 'Admin' }];
  selectedRoleId: string = '';
  filters: UserFilter = new UserFilter()
  actualPage: number = 0

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.filter();
  }

  async filter() {
    this.getFilters()
    try {
      const res = await firstValueFrom(this.userService.filter(this.filters))
      this.userPaginator = res
    } catch (error) {
      console.error('error en filtrar usuarios', error)
    }
  }

  getFilters(){
    this.filters.admin = undefined
    this.filters.page = this.actualPage
    this.filters.page_size = +this.selectedPageSize
    if (this.selectedRoleId != '') this.filters.admin = (+this.selectedRoleId == 2)
  }

  onChange(event: Event) {
    this.filter();
  }

  removeTypeUserFilter() {
    this.selectedRoleId = '';
    this.filter();
  }

  paginatorListener(event: any) {
    this.actualPage = event
    this.filter()
  }




}
