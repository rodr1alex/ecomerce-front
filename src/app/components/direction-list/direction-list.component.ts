import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Direction } from '../../models/general.model'; 
import { firstValueFrom } from 'rxjs';
import { DirectionService } from '../../services/direction.service';

@Component({
  selector: 'direction-list',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './direction-list.component.html'
})
export class DirectionListComponent implements OnInit {
  directionList: Direction[] = []
  directionNew: Direction = new Direction()
  userId: number = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private directionService: DirectionService) { }

  async ngOnInit(): Promise<void> {
    const id: number = +(this.route.snapshot.paramMap.get('id') || '0')
    this.userId = id
    await this.getDirectionListByUser(this.userId)
  }

  async getDirectionListByUser(userId: number) {
    try {
      const res = await firstValueFrom(this.directionService.getByUserId(userId))
      this.directionList = res
    }
    catch (err) {
      console.error('error en getDirectionListByUser', err)
    }
  }

  async onCreateDirection(direction: Direction) {
    //validar
    await this.createDirection(direction)
    this.getDirectionListByUser(this.userId)
  }

  async createDirection(direction: Direction) {
    try {
      const res = await firstValueFrom(this.directionService.create(direction, this.userId))
      alert('Direccion creada con exito')
    } catch (error) {
      alert('Error agregando la direccion')
      console.error('error en createDirection', error)
    }
  }

  async onUpdateDirection(direction: Direction) {
    //validar
    await this.updateDirection(direction)
    this.getDirectionListByUser(this.userId)
  }

  async updateDirection(direction: Direction) {
    try {
      const res = await firstValueFrom(this.directionService.update(direction))
      alert('Direccion actualizada con exito')
    } catch (error) {
      alert('Error actualizando la direccion')
      console.error('error en updateDirection', error)
    }
  }

  async onDeleteDirection(directionId: number) {
    try {
      const res = await firstValueFrom(this.directionService.remove(directionId))
      alert('Direccion eliminada con exito')
      this.getDirectionListByUser(this.userId)
    } catch (error) {
      alert('Error eliminando la direccion')
      console.error('error en onDeleteDirection', error)
    }
  }

  onBack() {
    this.router.navigate(['/update_user', this.userId])
  }

}
