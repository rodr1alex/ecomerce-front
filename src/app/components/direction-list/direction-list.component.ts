import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  directionList!: Direction[]
  directionNew : Direction = new Direction();
  user_id!: number;

  constructor(private userService: UserService, private sharingDataService: SharingDataService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id')|| '0');
      this.user_id = id;
    })

    this.userService.findById(this.user_id).subscribe(
      {
        next: response => {
          this.directionList = response.directionList;
        },
        error: error =>{
          throw error;
        }
      }
    )
  }

  createDirection(direction: Direction){
    console.log("Direccion a crear: ", direction);
    this.sharingDataService.createDirectionEventEmitter.emit({direction: direction, user_id: this.user_id});
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
