import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  constructor(private http: HttpClient) {}

  turnsByDoctor(id: number) {
    return this.http.get(`${environment.apiBase}/Turnos/${id}`);
  }
  
  datesByTurn(id: number) {
    return this.http.get(`${environment.apiBase}/Fechas/Turnos/${id}`);
  }

}
