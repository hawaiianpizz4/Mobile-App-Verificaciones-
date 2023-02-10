import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  getHist = [];
  constructor(
    private _services: dataService,
    private toastController: ToastController
  ) {}

  handleRefresh(event) {
    setTimeout(() => {
      this._services
        .getHist(JSON.parse(localStorage.getItem('user')))
        .subscribe(
          (data) => {
            this.getHist = data;
            localStorage.setItem('historial', JSON.stringify(data));
          },
          (error) => {
            console.log(error);
          }
        );
      event.target.complete();
      this.presentToast(
        'La Informacion ha sido Actualizada correctamente',
        'pulse-outline',
        'success'
      );
    }, 2000);
  }

  async presentToast(message, icon, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      icon: icon,
      color: color,
    });
    await toast.present();
  }
  ngOnInit() {
    this._services.getHist(JSON.parse(localStorage.getItem('user'))).subscribe(
      (data) => {
        this.getHist = data;
        localStorage.setItem('historial', JSON.stringify(data));
      },
      (error) => {
        console.log(error);
      }
    );
    this.getHist = JSON.parse(localStorage.getItem('historial'));
  }
}
