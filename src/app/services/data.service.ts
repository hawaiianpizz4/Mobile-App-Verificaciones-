import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class dataService {
  constructor(private _http: HttpClient) {}
  getDatos(user: string) {
    return this._http.get<any>(
      `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=user&nombre=${user}`
    );
  }
  getFood(id: number) {
    return this.getDatos(localStorage.getItem('user')).pipe(
      map((user) => user.find((e: any) => e.cedulaCliente == id.toString()))
    );
  }
  getHist(user: string) {
    return this._http.get<any>(
      `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=historial&nombre=${user}`
    );
  }
  getCurrentPoss(lat: number, long: number, apiKey: string) {
    return this._http.get<any>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json?access_token=${apiKey}`
    );
  }
  getUserVerification() {
    return this._http.get<any>(
      'http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=UsuariosVerificaciones'
    );
  }

  sendRequestVerifi(cedula:number) {
    return this._http.get<any>(
      `http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=UpdateUser&cedula=${cedula}`
    );
  }
}
