import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

export interface ConfirmAlertOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success(title = 'Exito', text = 'Operacion realizada correctamente'): Promise<void> {
    return this.fireIconAlert('success', title, text);
  }

  error(title = 'Error', text = 'Ha ocurrido un problema'): Promise<void> {
    return this.fireIconAlert('error', title, text);
  }

  warning(title = 'Atencion', text = ''): Promise<void> {
    return this.fireIconAlert('warning', title, text);
  }

  info(title = 'Informacion', text = ''): Promise<void> {
    return this.fireIconAlert('info', title, text);
  }

  async confirm(options: ConfirmAlertOptions = {}, callback?: () => void): Promise<boolean> {
    const {
      title = 'Confirmar accion',
      text = 'Estas seguro de continuar?',
      icon = 'question',
      confirmButtonText = 'Si, continuar',
      cancelButtonText = 'Cancelar',
      confirmButtonColor = '#3085d6',
      cancelButtonColor = '#6b7280'
    } = options;

    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      reverseButtons: false
    });

    if (result.isConfirmed && callback) callback();
    return result.isConfirmed;
  }

  deleteConfirm(entity = 'este registro'): Promise<boolean> {
    return this.confirm({
      title: 'Eliminar',
      text: `Esta accion eliminara ${entity}.`,
      icon: 'warning',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });
  }

  toastSuccess(title = 'Exito', timer = 2200): Promise<void> {
    return this.fireToast('success', title, timer);
  }

  toastError(title = 'Error', timer = 2600): Promise<void> {
    return this.fireToast('error', title, timer);
  }

  showLoading(title = 'Procesando', text = 'Espera un momento...'): Promise<void> {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => undefined);
  }

  close(): void {
    Swal.close();
  }

  isVisible(): boolean {
    return Swal.isVisible();
  }

  custom(options: SweetAlertOptions): Promise<void> {
    return Swal.fire(options).then(() => undefined);
  }

  private fireIconAlert(icon: SweetAlertIcon, title: string, text: string): Promise<void> {
    const normalizedText = text || '';
    const html = this.toSafeHtmlWithBreaks(normalizedText);

    return Swal.fire({
      icon,
      title,
      html,
      confirmButtonText: 'Aceptar'
    }).then(() => undefined);
  }

  private toSafeHtmlWithBreaks(text: string): string {
    return this.escapeHtml(text).replace(/\n/g, '<br>');
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private fireToast(icon: SweetAlertIcon, title: string, timer: number): Promise<void> {
    return Swal.fire({
      toast: true,
      icon,
      title,
      position: 'top-end',
      showConfirmButton: false,
      timer,
      timerProgressBar: true
    }).then(() => undefined);
  }
}