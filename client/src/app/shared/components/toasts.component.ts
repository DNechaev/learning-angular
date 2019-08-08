import { Component, HostBinding, TemplateRef } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [header]="toast.header"
      [autohide]="true"
      [delay]="toast.delay || 3000"
      (hide)="toastService.remove(toast)"
    >
      <ng-container *ngIf="isTemplate(toast) else text">
        <ng-container *ngTemplateOutlet="toast.textOrTpl"></ng-container>
      </ng-container>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
})
export class ToastsComponent {
  @HostBinding('class.ngb-toasts') role = 'true';
  constructor(public toastService: ToastService) {}
  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
