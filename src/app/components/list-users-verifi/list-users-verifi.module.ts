import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ListUsersVerifiComponent } from "./list-users-verifi.component";



@NgModule({
    declarations:[ListUsersVerifiComponent],
    imports:[CommonModule, IonicModule],
    exports:[ListUsersVerifiComponent],
})
export class ListUsersVerifiComponentModule {}