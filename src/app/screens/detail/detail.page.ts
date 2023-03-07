import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ModalInfoPage } from 'src/app/components/modal-info/modal-info.page';
import { Network } from '@capacitor/network';
import { presentToast } from 'src/app/utils/Utils';
import { dataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/utils/LoadingService';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: number;
  getdata = [];
  cedula: string;
  operacion: string;
  gestor: string;
  networkStatus: boolean;
  disabledButton = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private ngZone: NgZone,
    private _services: dataService,
    private loadingService: LoadingService
  ) {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    const users = JSON.parse(localStorage.getItem('storage'));
    const v = Object.entries(users);
    const Total: any = [];
    v.map((m) => {
      Total.push(m[1]);
    });
    this.getdata = Total.find((e) => e.numeroCredito == this.id);
    if (!this.getdata) {
      this.presentToast('Error, El usuario no se pudo encontrar');
      this.redirect();
    }

    this.changeStatus();
  }

  async ngOnInit() {
    Network.addListener('networkStatusChange', (status) => {
      this.ngZone.run(() => {
        this.changeStatus();
      });
    });
  }

  async changeStatus() {
    const status = await Network.getStatus();
    console.log(status);
    this.networkStatus = status?.connected;
    this.networkStatus ? presentToast('Conectado', 'wifi-outline', 'success') : presentToast('Sin conexion', 'globe-outline', 'warning');
  }

  redirect() {
    this.navCtrl.navigateForward('home/listing');
  }
  async openModal(cedula: string, operacion: string, gestor: string) {
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
      componentProps: {
        cedula: cedula,
        operacion: operacion,
        gestor: gestor,
      },
    });
    await modal.present();
  }

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      mode: 'ios',
      duration: 2000,
      position: 'bottom',
      icon: 'alert-circle-outline',
      color: 'danger',
    });
    toast.present();
  }

  async goToDetailPage(id: string, operacion: string) {
    const loading = await this.loadingService.createLoading('Verificando Refinanciamiento...', 10000);

    this._services
      .getRefinanciamiento(operacion)
      .toPromise()
      .then((operacionActual) => {
        presentToast(`Aviso, Operación actual ya ha sido refinanciada (${operacionActual.id})`, 'checkmark-outline', 'warning');
      })
      .catch((err) => {
        if (!this.networkStatus) {
          presentToast('Error, No hay conexión a internet', 'checkmark-outline', 'warning');
          return;
        } else {
          this.router.navigate(['refi-detail', id, operacion]);
        }
      });
    await loading.dismiss();
  }
}
