import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { Button2Component } from "./button2.component";


@NgModule({
    declarations:[Button2Component],
    imports:[CommonModule,IonicModule],
    exports:[Button2Component],
})
export class Button2Module{}