import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ListUsersVerifiComponent } from "./list-users-verifi.component";
// import { ButtonModule } from 'src/app/components/button/button.module';

import { Button2Module } from "../button2/button2.module";



@NgModule({
    declarations:[ListUsersVerifiComponent],
    imports:[CommonModule, IonicModule, Button2Module],
    exports:[ListUsersVerifiComponent],
})
export class ListUsersVerifiComponentModule {}