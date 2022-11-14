import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodServices {
  constructor(private _http:HttpClient){}
  getDatos<T>(url:string){
    url= 'http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=user&nombre=JDLARA';
    return this._http.get<T[]>(url);
  }
  getFoods(): Food[] {
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
    return  this.getDatos("").pipe(map(user=>user.find((e:any)=>e.cedulaCliente == id.toString())));
  }
}
