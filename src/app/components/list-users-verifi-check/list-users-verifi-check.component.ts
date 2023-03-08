import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from 'src/app/services/data.service';
import { Verificaciones2Page } from 'src/app/screens/verificaciones2/verificaciones2.page';

@Component({
  selector: 'app-list-users-verifi-check',
  templateUrl: './list-users-verifi-check.component.html',
  styleUrls: ['./list-users-verifi-check.component.scss'],
})
export class ListUsersVerifiCheckComponent {

  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  dndlN_telefonocelular: string ;
  codigo: string ;
  latitud: number ;
  longitud: number ;

  constructor(
    private router: Router ,
    private Verificaciones2Page: Verificaciones2Page,
    private dataService: dataService,
    ) {}

    goToVerificacion() {
      this.latitud = this.item.latitud; // Reemplaza "item.latitude" con el nombre correcto del campo que contiene la latitud en tus datos
      this.longitud = this.item.longitud; // Reemplaza "item.longitude" con el nombre correcto del campo que contiene la longitud en tus datos
      this.router.navigate(['verificacion', this.item]);
    }


    openMap(event) {
      event.preventDefault(); // Evita que se siga el enlace
      window.open(event.target.href, '_blank'); // Abre el enlace en una nueva pestaña
    }



}
