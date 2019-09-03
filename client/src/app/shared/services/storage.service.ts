import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  setItem(key: string, data: any, long = false): void {
    try {
      this.removeItem(key);
      if (long) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        sessionStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      if (long) {
        console.error('Error saving to localStorage', e);
      } else {
        console.error('Error saving to sessionStorage', e);
      }
    }
  }

  getItem(key: string, defaultValue = null): any {
    try {
      const value = JSON.parse(localStorage.getItem(key) ? localStorage.getItem(key) : sessionStorage.getItem(key));
      return value === null ? defaultValue : value ;
    } catch (e) {
      console.error('Error getting data from Storage', e);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

}
