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

@Component({
  selector: 'sale-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './sale-list.component.html'
})
export class SaleListComponent implements OnInit{
  saleList: Sale[] = [];
  paginator!: any;
  url: string = '/admin_panel/2/0';
  page!: number;
  pageSizeList: number[] = [5,10,20,50,100,200,500];
  selectedPageSize: string = '10';
  userList!: User[];
  selectedUser: string = '';
  startTotal: number = 0;
  endTotal: number = 0;
  filtredByTotal:boolean = false;




  constructor(
    private baseProductService: BaseProductService,
    private finalProductService: FinalProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private saleService: SaleService
  ){

}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.page = +(params.get('page') || '0');;
      this.filter();
    })

    this.userService.findAll().subscribe({
      next: response =>{
        this.userList = response;
      }
    })

  }

  onChange(event: Event){
    console.log('cambiooo')
    this.filter();
    this.router.navigate(['/admin_panel/2/0/0'])
  }

  filter(){
    this.saleService.filter(+this.selectedUser, +this.startTotal, +this.endTotal, +this.selectedPageSize, this.page).subscribe({
      next: response =>{
        this.paginator = response;
        this.saleList = response.content;
      }
    })
  }

  unfilter(){

  }

  removeUserFilter(){
    this.selectedUser = '';
    this.filter();
  }

}
