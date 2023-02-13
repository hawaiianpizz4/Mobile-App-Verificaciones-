import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ListUsersVerifiCheckComponent} from "./list-users-verifi-check.component";



@NgModule({
    declarations:[ListUsersVerifiCheckComponent],
    imports:[CommonModule, IonicModule],
    exports:[ListUsersVerifiCheckComponent],
})
export class ListUsersVerifiCheckComponentModule {}