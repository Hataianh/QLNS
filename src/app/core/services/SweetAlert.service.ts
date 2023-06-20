import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  showSuccessAlert(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    });
  }

  showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }

  showWarningAlert(title: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
    });
  }

  showInfoAlert(title: string, message: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
    });
  }
}
