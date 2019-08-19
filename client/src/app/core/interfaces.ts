import { TemplateRef } from '@angular/core';

export interface Toast {
  classname: string;
  delay: number;
  header: string;
  textOrTpl: string | TemplateRef<any>;
}
