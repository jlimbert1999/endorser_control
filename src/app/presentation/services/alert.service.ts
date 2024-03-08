import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

interface AlertOptions {
  title: string;
  text?: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
}

interface QuestionAlertOptions {
  title: string;
  text?: string;
  callback: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  Alert({ icon = 'info', title, text }: AlertOptions) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Aceptar',
    });
  }
  QuestionAlert({ title, text, callback }: QuestionAlertOptions) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3F51B5',
      cancelButtonColor: '#F44336',
      reverseButtons:true
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}
