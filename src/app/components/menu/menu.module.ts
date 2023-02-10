import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { MenuComponent } from "./menu.component";



@NgModule({
    declarations:[MenuComponent],
    imports:[CommonModule, IonicModule,RouterModule],
    exports:[MenuComponent],
})
export class menuModule{}