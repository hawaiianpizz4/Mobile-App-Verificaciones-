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

  getDatosOrigenRefi(id: string) {
    return this.getDatos(localStorage.getItem('user')).pipe(
      map((user) => user.find((e: any) => e.cedula == id.toString()))
    );
  }

  getListaClientesRefi() {
    return this._http.get<any>(
      `http://171.23.12.43/API_Cobranzas/controller/refinanciamiento.php?op=getClientes`
      // `http://172.16.10.49/API_Cobranzas/controller/refinanciamiento.php?op=getClientes`
    );
  }

  getDatosCliente(id: string) {
    return this._http.get<any>(
      `http://171.23.12.43/API_Cobranzas/controller/refinanciamiento.php?op=getClientesId&id=${id}`
      // `http://172.16.10.49/API_Cobranzas/controller/refinanciamiento.php?op=getClientesId&id=${id}`
    );
  }
}
