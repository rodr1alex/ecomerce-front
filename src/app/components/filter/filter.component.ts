import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html'
})

export class FilterComponent {
  orderByList: string[]= [
    'Nombre A-Z',
    'Nombre Z-A ',
    'Menor precio',
    'Mayor precio'
  ]
  orderBySelected: string = '';


  auxMostrarSeleccionado(){
    console.log(this.orderBySelected);
  }

}
