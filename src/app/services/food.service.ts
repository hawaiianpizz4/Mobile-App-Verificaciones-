import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HTTP } from "@ionic-native/http";

@Injectable({
  providedIn: 'root',
})
export class FoodServices {
  constructor(private _http:HttpClient){
    
  }
  getDatos(user:string){
    // url= 'http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=user&nombre=JDLARA';
    // console.log(user);
    return this._http.get<any>(`http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=user&nombre=${user}`);
  }
  getFoods(){
    return [
      {
        id: 1,
        title: 'Sea food',
        price: 12,
        image: 'assets/images/imagen.png',
        description:
          'Este se un mensaje de prueba para cada una de las columnas que se van a crear',
      },
      {
        id: 2,
        title: 'Sea food',
        price: 12,
        image: 'assets/images/imagen.png',
        description:
          'Este se un mensaje de prueba para cada una de las columnas que se van a crear',
      },
      {
        id: 3,
        title: 'Sea food',
        price: 12,
        image: 'assets/images/imagen.png',
        description:
          'Este se un mensaje de prueba para cada una de las columnas que se van a crear',
      },
    ];
  }
  getFood(id:number){
    return  this.getDatos(localStorage.getItem("user")).pipe(map(user=>user.find((e:any)=>e.cedulaCliente == id.toString())));
  }
}
