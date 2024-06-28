import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Direction } from '../../models/direction.model';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'direction-list',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './direction-list.component.html'
})
export class DirectionListComponent implements OnInit{
  direction_list!: Direction[]
  directionNew : Direction = new Direction();

  constructor(private userService: UserService, private sharingDataService: SharingDataService){}

  ngOnInit(): void {
    this.userService.findById(1).subscribe(
      {
        next: response => {
          console.log(response.directionList);
          this.direction_list = response.directionList;
        },
        error: error =>{
          throw error;
        }
      }
    )
  }

  createDirection(direction: Direction){
    console.log("Direccion a crear: ", direction);
    this.sharingDataService.createDirectionEventEmitter.emit(direction);
  }
  updateDirection(direction: Direction){
    console.log("Direccion actualizada:",direction);
    this.sharingDataService.updateDirectionEventEmitter.emit(direction);
  }
  deleteDirection(direction_id: number){
    console.log("Direction_id a borrar: ", direction_id);
    this.sharingDataService.deleteDirectionEventEmitter.emit(direction_id);
  }
}
