import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
    return this.getDatos(localStorage.getItem('user')).pipe(map((user) => user.find((e: any) => e.cedulaCliente == id.toString())));
  }
  getHist(user: string) {
    return this._http.get<any>(
      `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=historial&nombre=${user}`
    );
  }

  getDatosOrigenRefi(id: string) {
    return this.getDatos(localStorage.getItem('user')).pipe(map((user) => user.find((e: any) => e.cedula == id.toString())));
  }

  getListaClientesRefi() {
    return this._http.get<any>(
      `${environment.apiUrl}refinanciamiento.php?op=getClientes`
      // `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/refinanciamiento.php?op=getClientes`
      // `http://172.16.10.49/API_Cobranzas/controller/refinanciamiento.php?op=getClientes`
    );
  }

  getDatosCliente(id: string) {
    return this._http.get<any>(
      `${environment.apiUrl}refinanciamiento.php?op=getClientesId&id=${id}`
      // `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/refinanciamiento.php?op=getClientesId&id=${id}`
      // `http://172.16.10.49/API_Cobranzas/controller/refinanciamiento.php?op=getClientesId&id=${id}`
    );
  }

  getCurrentPoss(lat: number, long: number, apiKey: string) {
    return this._http.get<any>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json?types=address&access_token=${apiKey}`
    );
  }

  getUserVerification() {
    return this._http.get<any>('http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=UsuariosVerificaciones');
  }

  sendRequestVerifi(cedula: number) {
    return this._http.get<any>(`http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=UpdateUser&cedula=${cedula}`);
  }

  getUsersVerifi2() {
    return this._http.get<any>(
      `http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=VerificationforUser&nombreGestor=MRAMIREZ`
    );
  }

  getdireccion_clienteDetalleVer() {
    return this._http.get<any>(
      `http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=direccion_cliente`
    )
  }

  sendTextMessage(numero: string) {
    // const apiUrl = `http://200.7.249.21:90/ApiTextMessageMovil/api/enviomensaje?send=${codigo}&number=${dndlN_telefonocelular}&apikey=API_KEY`;
    // const apiUrl = `http://200.7.249.21:90/ApiTextMessageMovil/api/enviomensaje?send=message&number=${numero}&message=X12345`;
    const data = {
      codigo: 'X12345'
    }
    // return this._http.get(apiUrl);
    return data;
  }

}
