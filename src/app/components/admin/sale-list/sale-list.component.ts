import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { SaleService } from '../../../services/sale.service';
import { User } from '../../../models/general.model'; 
import { UserService } from '../../../services/user.service';
import { Page, AdminSaleBasicInfo, SaleFilter } from '../../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'sale-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './sale-list.component.html'
})
export class SaleListComponent implements OnInit {
  salePaginator: Page<AdminSaleBasicInfo> = new Page<AdminSaleBasicInfo>();
  page!: number;
  pageSizeList: number[] = [5, 10, 20, 50, 100, 200, 500];
  selectedPageSize: string = '10';
  userList!: User[];
  selectedUser: string = '';
  startTotal: number = 0;
  endTotal: number = 0;
  selectedStatus: string = 'Estado';
  statusList: string[] = ['Estado', 'Realizada', 'Modificada', 'Anulada'];
  filter: SaleFilter = new SaleFilter()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private saleService: SaleService,
  ) {}
  
  ngOnInit(): void {
    const page: number = +(this.route.snapshot.paramMap.get('page') || '0')
    this.page = page
    this.getSales(this.filter)  
    this.getUsers()
    this.getSaleStatuses()
  }

  onChange(event: Event) {
    this.onFilter()
    this.router.navigate(['/admin_panel/1', 0])
  }

  async getSaleStatuses(){
    try {
      const res = await firstValueFrom(this.saleService.getSaleStatuses())
    } catch (error) {
      console.error('error en getSaleStatuses')
    }
  }

  async getUsers(){
    try {
      const res = await firstValueFrom(this.userService.findAll())
      this.userList = res
    } catch (error) {
      console.error('error en getUsers', error)
    }
  }

  async getSales(filter: SaleFilter){
     try {
      const res = await firstValueFrom(this.saleService.filter(filter))
      this.salePaginator = res
    } catch (error) {
      console.error('error en getSales', error)      
    }
  }

  onFilter() {
    this.setFilters()
    this.getSales(this.filter)
  }


  setFilters() {
    this.filter.userId = +this.selectedUser == 0 ? null: +this.selectedUser
    this.filter.pageSize = +this.selectedPageSize
    this.filter.page = this.page
  }

   paginatorListener(event: any) {
    this.page = event
    this.onFilter()
  }


  removeUserFilter() {
    this.selectedUser = '';
    this.onFilter();
  }

  removeStatusFilter() {
    this.selectedStatus = 'Estado';
    this.onFilter();
  }

  formatCurrency(value: number): string {
    if (value == undefined) {
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  filterByTotal() {
    if (this.startTotal < this.endTotal) {
      this.onFilter();
    } else {
      alert('La cantidad minima debe ser menor que la maxima!')
    }
  }

  removeTotalFilter() {
    this.startTotal = 0;
    this.endTotal = 0;
    this.onFilter();
  }

}
