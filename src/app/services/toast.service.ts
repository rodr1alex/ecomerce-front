import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: false,
    // didOpen: (toast) => {
    //   toast.addEventListener('mouseenter', Swal.stopTimer);
    //   toast.addEventListener('mouseleave', Swal.resumeTimer);
    // }
  });

  success(title = 'Operacion realizada con exito', timer = 2200): Promise<void> {
    return this.show('success', title, timer);
  }

  error(title = 'Ha ocurrido un error', timer = 2600): Promise<void> {
    return this.show('error', title, timer);
  }

  warning(title = 'Atencion', timer = 2400): Promise<void> {
    return this.show('warning', title, timer);
  }

  info(title = 'Informacion', timer = 2200): Promise<void> {
    return this.show('info', title, timer);
  }

  saved(title = 'Cambios guardados'): Promise<void> {
    return this.success(title);
  }

  created(title = 'Registro creado correctamente'): Promise<void> {
    return this.success(title);
  }

  updated(title = 'Registro actualizado correctamente'): Promise<void> {
    return this.success(title);
  }

  deleted(title = 'Registro eliminado correctamente'): Promise<void> {
    return this.success(title);
  }

  copied(title = 'Copiado al portapapeles'): Promise<void> {
    return this.info(title, 1800);
  }

  custom(options: SweetAlertOptions): Promise<void> {
    return this.toast.fire(options).then(() => undefined);
  }

  private show(icon: SweetAlertIcon, title: string, timer: number): Promise<void> {
    return this.toast
      .fire({
        icon,
        title,
        timer
      })
      .then(() => undefined);
  }
}