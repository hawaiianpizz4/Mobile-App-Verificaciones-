import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ListUsersVerifiCheckComponent} from "./list-users-verifi-check.component";
import { ButtonModule } from 'src/app/components/button/button.module';



@NgModule({
    declarations:[ListUsersVerifiCheckComponent],
    imports:[CommonModule, IonicModule,ButtonModule],
    exports:[ListUsersVerifiCheckComponent],
})
export class ListUsersVerifiCheckComponentModule {}