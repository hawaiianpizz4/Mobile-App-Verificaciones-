import { Component, EventEmitter, Input, Output} from '@angular/core';
import { NavController } from '@ionic/angular';
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
  constructor(
    private router: Router ,
    private Verificaciones2Page: Verificaciones2Page,
    private dataService: dataService,
    ) {}

    goToVerificacion() {




      this.router.navigate(['verificacion', this.item]);
    }


}
