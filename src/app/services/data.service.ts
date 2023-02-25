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

  getHistorialRefi(user: string) {
    const url = `http://200.7.249.21:90/VerificacionesFisicas/Api_Cobranzas/controller/refinanciamiento.php?opcion=getHistorial&nombre=${user}`;
    console.log(url);
    return this._http.get<any>(url);
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
      `${environment.apiUrl}refinanciamiento.php?opcion=getClientesId&id=${id}`
      // `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/refinanciamiento.php?op=getClientesId&id=${id}`
      // `http://172.16.10.49/API_Cobranzas/controller/refinanciamiento.php?op=getClientesId&id=${id}`
    );
  }

  getCurrentPoss(lat: number, long: number, apiKey: string) {
    return this._http.get<any>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json?types=address&access_token=${apiKey}`
    );
  }

  getUsersParaReservar() {
    return this._http.get<any>(`${environment.apiUrl}verificacion.php?opcion=getUsersParaReservar`);
  }

  reservarVerificacionUser(cedula, nombreGestor) {
    return this._http.get<any>(
      `${environment.apiUrl}verificacion.php?opcion=reservarVerificacionUser&cedula=${cedula}&nombreGestor=${nombreGestor}`
    );
  }

  getUsersVerifi2(nombreGestor) {
    const url = `${environment.apiUrl}verificacion.php?opcion=getUsersVerificados&nombreGestor=${nombreGestor}`;
    console.log(url);

    return this._http.get<any>(url);
  }

  getdireccion_clienteDetalleVer() {
    return this._http.get<any>(`http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=direccion_cliente`);
  }

  sendTextMessage(numero: string) {
    const url = `${environment.apiUrl}verificacion.php?opcion=send&number=593998439756`;
    // const url = `${environment.apiUrl}verificacion.php?opcion=send&number=${numero}`;

    // const data = {
    //   codigo: 'X12345',
    // };
    return this._http.get<any>(url);

    // return data;
  }
}
