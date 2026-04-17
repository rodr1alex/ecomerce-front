import { Component, OnInit } from '@angular/core';
import { User } from '../../models/general.model'; 
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'update-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent implements OnInit {
  userId!: number
  userName!: string
  isAdmin!: boolean;
  actualPassword: string = ''
  newPassword: string = ''
  repeatNewPassword: String = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id: number = +(this.route.snapshot.paramMap.get('id') || '0')
    this.userId = id
    this.userName = this.authService.user.user.username
    this.isAdmin = this.authService.user.isAdmin
  }

  onClear(userForm: NgForm): void {
    userForm.reset();
    userForm.resetForm();
  }

  async onUpdatePassword() {
    const sussessfullLogin: boolean = await this.login()
    if (!sussessfullLogin) return alert('Contrasenia ingresada es incorrecta!')
    this.updatePassword()
  }

  async updatePassword() {
    const user: User = new User()
    user.id = this.userId
    user.username = this.authService.user.user.username
    user.password = this.newPassword
    try {
      const res = await firstValueFrom(this.userService.updatePassword(user))
      alert('Contrasenia actualizada con exito');
      this.router.navigate(['/home'])
    } catch (error) {
      console.error('error en updatePassword', error)
    }
  }

  async login(): Promise<boolean> {
    const user: User = new User()
    user.id = this.userId
    user.username = this.authService.user.user.username
    user.password = this.actualPassword
    try {
      const res = await firstValueFrom(this.authService.loginUser(user))
      return true
    }
    catch (err) {
      console.error('Error en login', err)
      return false
    }
  }

  onBack() {
    const user_id = this.authService.user.id
    this.router.navigate(['/update_user', this.userId])
  }



}
