import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class dataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

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
    const url = `${environment.apiUrl}refinanciamiento.php?opcion=getHistorial&nombre=${user}`;
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

  postFormRefi(postData) {
    const url = `${environment.apiUrl}refinanciamiento.php?opcion=postDatosRefi`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this._http.post(url, JSON.stringify(postData), httpOptions);
  }

  getCurrentPoss(lat: number, long: number, apiKey: string) {
    return this._http.get<any>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json?types=address&access_token=${apiKey}`
    );
  }

  getClientesParaReservar() {
    return this._http.get<any>(`${environment.apiUrl}verificacion.php?opcion=getClientesParaReservar`);
  }

  setClienteReservado(cedula, nombreGestor, latitud, longitud) {
    return this._http.post<any>(
      `${environment.apiUrl}verificacion.php?opcion=setClienteReservado&cedula=${cedula}&nombreGestor=${nombreGestor}
      &latitud=${latitud}
      &longitud=${longitud}`,
      null
    );
  }

  getClientesParaVerificar(nombreGestor) {
    const url = `${environment.apiUrl}verificacion.php?opcion=getClientesParaVerificar&nombreGestor=${nombreGestor}`;
    console.log(url);
    return this._http.get<any>(url);
  }
  getClientesVerificados(nombreGestor) {
    const url = `${environment.apiUrl}verificacion.php?opcion=getClientesVerificados&nombreGestor=${nombreGestor}`;
    console.log(url);
    return this._http.get<any>(url);
  }

  getdireccion_clienteDetalleVer() {
    return this._http.get<any>(`http://200.7.249.21:90/ApiVerificaciones/api/verificaciones?consult=direccion_cliente`);
  }

  getSmsCode(numero: string) {
    const url = `${environment.apiUrl}verificacion.php?opcion=getSmsCode&number=${numero}`;
    return this._http.get<any>(url);
  }

  getProvincia(codigo) {
    const url = `${environment.apiUrl}catalogos.php?opcion=getNombreCatalogo&codigo=${codigo}&tipo=provincia`;
    return this._http.get<any>(url);
  }

  getCanton(codigo) {
    const url = `${environment.apiUrl}catalogos.php?opcion=getNombreCatalogo&codigo=${codigo}&tipo=canton`;
    return this._http.get<any>(url);
  }

  getParroquia(codigo) {
    const url = `${environment.apiUrl}catalogos.php?opcion=getNombreCatalogo&codigo=${codigo}&tipo=parroquia`;
    return this._http.get<any>(url);
  }

  getRefinanciamiento(operacion) {
    const url = `${environment.apiUrl}refinanciamiento.php?opcion=getRefinanciamiento&operacion=${operacion}`;
    return this._http.get<any>(url);
  }
}
