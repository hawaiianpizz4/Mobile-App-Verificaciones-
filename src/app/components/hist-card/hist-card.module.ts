import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HistCardComponent } from "./hist-card.component";



@NgModule({
    declarations:[HistCardComponent],
    imports:[CommonModule, IonicModule],
    exports:[HistCardComponent],
})
export class HistCardComponentModule {}