import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarrerService {
  constructor(private http: HttpClient) {}

  getCarrers(): Observable<any> {
    return this.http.get(`${environment.apiBase}/Especialidades`);
  }

  daysByCarrer(id: number){
    return this.http.get(`${environment.apiBase}/Dias/${id}`);
  }
}
