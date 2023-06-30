import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  doctorsByCarrerId(id: number): Observable<any> {
    return this.http.get(`${environment.apiBase}/Doctores/${id}`);
  }

  daysByDoctor(id: number) {
    return this.http.get(`${environment.apiBase}/Dias/Doctores/${id}`);
  }
}
