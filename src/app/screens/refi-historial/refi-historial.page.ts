import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-refi-historial',
  templateUrl: './refi-historial.page.html',
  styleUrls: ['./refi-historial.page.scss'],
})
export class RefiHistorialPage implements OnInit {
  getHist = [];
  constructor(private _services: dataService, private toastController: ToastController) {}

  handleRefresh(event) {
    this.getHist = [];
    setTimeout(() => {
      this._services.getHistorialRefi(JSON.parse(localStorage.getItem('user'))).subscribe(
        (data) => {
          console.log(data);
          this.getHist = data;
          localStorage.setItem('historial-refi', JSON.stringify(data));
        },
        (error) => {
          console.log('asfasdf');
          console.log(error);
        }
      );
      event.target.complete();
      this.presentToast('La Informacion ha sido Actualizada correctamente', 'pulse-outline', 'success');
    }, 2000);
  }

  async presentToast(message, icon, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      icon: icon,
      color: color,
    });
    await toast.present();
  }
  ngOnInit() {
    this.getHist = [];
    this._services.getHistorialRefi(JSON.parse(localStorage.getItem('user'))).subscribe(
      (data) => {
        console.log(data);
        this.getHist = data;
        localStorage.setItem('historial-refi', JSON.stringify(data));
      },
      (error) => {
        console.log(error);
      }
    );
    this.getHist = JSON.parse(localStorage.getItem('historial-refi'));
  }
}
