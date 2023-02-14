import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ListUsersVerificadosComponent} from "./list-users-verificados.component";
import { ButtonModule } from 'src/app/components/button/button.module';



@NgModule({
    declarations:[ListUsersVerificadosComponent],
    imports:[CommonModule, IonicModule,ButtonModule],
    exports:[ListUsersVerificadosComponent],
})
export class ListUsersVerificadosComponentModule {}