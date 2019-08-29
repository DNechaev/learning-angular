import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { URL_API_REPORT } from '../core/consts';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl: string = URL_API_REPORT;

  constructor(
    private http: HttpClient
  ) {}

  getReport(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

}
