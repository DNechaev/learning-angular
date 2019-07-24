import { Injectable, TemplateRef } from '@angular/core';
import { Toast } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  info(dangerTpl) {
    this.show(dangerTpl, { classname: 'bg-info text-light', delay: 2000, header: 'Info' });
  }

  success(dangerTpl) {
    this.show(dangerTpl, { classname: 'bg-success text-light', delay: 2000, header: 'Success' });
  }

  warning(dangerTpl) {
    this.show(dangerTpl, { classname: 'bg-warning text-light', delay: 8000, header: 'Warning'  });
  }

  danger(dangerTpl) {
    this.show(dangerTpl, { classname: 'bg-danger text-light', delay: 10000, header: 'Danger'  });
  }

}
