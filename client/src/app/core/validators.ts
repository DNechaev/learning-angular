import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateDate(dateBeginKey: string, dateEndKey: string): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    const dateBegin = new Date(group.get(dateBeginKey).value);
    const dateEnd = new Date(group.get(dateEndKey).value);
    return dateEnd < dateBegin ? { date: true } : null;
  };
}
