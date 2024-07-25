import { Component, OnInit } from '@angular/core';
import { BaseProductService } from '../../../services/base-product.service';
import { FinalProductService } from '../../../services/final-product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ColorService } from '../../../services/color.service';
import { SizeService } from '../../../services/size.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Sale } from '../../../models/sale.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { SaleService } from '../../../services/sale.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Cart } from '../../../models/cart.model';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'sale-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './sale-list.component.html'
})
export class SaleListComponent implements OnInit{
  saleList: Sale[] = [];
  cartList: Cart[] = [];
  cartListDB: Cart[] = [];
  paginator!: any;
  url: string = '/admin_panel/1';
  page!: number;
  pageSizeList: number[] = [5,10,20,50,100,200,500];
  selectedPageSize: string = '10';
  userList!: User[];
  selectedUser: string = '';
  startTotal: number = 0;
  endTotal: number = 0;
  selectedStatus: string = 'Estado' ;
  statusList: string [] = ['Estado', 'Realizada', 'Modificada', 'Anulada'];




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private saleService: SaleService,
    private cartService: CartService
  ){

}
  ngOnInit(): void {
    this.cartService.findAll().subscribe({
      next: response =>{
        this.cartListDB = response;
        this.route.paramMap.subscribe(params => {
          this.page = +(params.get('page') || '0');;
          this.filter();
        })
      }
    })    
    this.userService.findAll().subscribe({
      next: response =>{
        this.userList = response;
      }
    })

  }

  onChange(event: Event){
    this.filter();
    this.router.navigate(['/admin_panel/1', 0])
  }

  filter(){
    
    this.saleService.filter(+this.selectedUser, +this.startTotal, +this.endTotal, +this.selectedPageSize, this.page, this.selectedStatus).subscribe({
      next: response =>{
        this.paginator = response;
        this.saleList = response.content;
        this.cartList = [];
        for(let sale of this.saleList){
          this.cartList.push(this.findCartById(sale.cart_id)|| new Cart());
        }
        
      }
    })

  }

  unfilter(){

  }

  removeUserFilter(){
    this.selectedUser = '';
    this.filter();
  }
  removeStatusFilter(){
    this.selectedStatus = 'Estado';
    this.filter();
  }

  formatCurrency(value: number): string {
    if(value == undefined){
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  findCartById(cart_id: number){
    return this.cartListDB.find(item => item.cart_id == cart_id);
  }

  filterByTotal(){
    if(this.startTotal < this.endTotal){
      this.filter();
    }else{
      alert('La cantidad minima debe ser menor que la maxima!')
    }
    
  }
  removeTotalFilter(){
    this.startTotal = 0;
    this.endTotal = 0;
    this.filter();
  }
}
