import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { BadgeComponent } from "./badge.component";


@NgModule({
    declarations:[BadgeComponent],
    imports:[CommonModule, IonicModule],
    exports:[BadgeComponent],
})
export class BadgeModule{}