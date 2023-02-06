import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';
import { ModalManualPage } from '../modal-manual/modal-manual.page';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  getdata = [];
  public results: any[] = [];
  usuarioInsert;
  constructor(
    private router: Router,
    private _services: dataService,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
  ) {
  }
 
  handleRefresh(event) {
    setTimeout(() => {
      if(this.usuarioInsert=localStorage.getItem("user").length>2){
        localStorage.setItem('storage',JSON.stringify([]));
        this._services
          .getDatos(JSON.parse(localStorage.getItem('user')))
          .subscribe(
            (data) => {
              this.getdata = data;
              localStorage.setItem('storage', JSON.stringify(data));
            },
            (error) => {
              console.log(error);
            }
          );
      }else{
        this.presentAlert();
      }  
      event.target.complete();
      this.presentToast("La Informacion ha sido Actualizada correctamente","pulse-outline","success");
    }, 2000);
  };
  ngOnInit() {
    if (!localStorage.getItem('storage')) {
      if (localStorage.getItem('user')) {
        this._services
          .getDatos(JSON.parse(localStorage.getItem('user')))
          .subscribe(
            (data) => {
              this.getdata = data;
              localStorage.setItem('storage', JSON.stringify(data));
              
            },
            (error) => {
              console.log(error);
            }
          );
      }else{
        this.presentAlert();
      }
    } else {
      this.getdata = JSON.parse(localStorage.getItem('storage'));
    }
    // console.log(this.getdata);
  }
  
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalManualPage
    });
    return await modal.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ingresa tu usuario',
      subHeader: 'Este usuario no se podra cambiar!',
      message:'Mediante el usuario se filtrara la información que se mostrara en la aplicación',
      inputs: [
        {
          placeholder: 'UsuarioMbcase',
          name: 'usuario',
        },
      ],
      buttons: [
        {
          text: 'ok',
          handler: (alertData) => {
            localStorage.setItem('user', JSON.stringify(alertData.usuario));
            // setTimeout(() => {
            //   window.location.reload();
            // }, 100);
          },
        },
      ],
    });

    await alert.present();
  }
  goToDetailPage(id: number) {
    this.router.navigate(['detail', id]);
  }
  handleChange(event) {
    const query = event.target.value.toLowerCase();
    var users = JSON.parse(localStorage.getItem('storage'));
    const v = Object.entries(users);
    const Total: any = [];
    v.map((m) => {
      Total.push(m[1]);
    });
    this.results = Total.filter((e) => e.cedulaCliente.includes(query));
  }
  async presentToast(mensaje,icon,color){
    const toast = await this.toastCtrl.create({
      message:mensaje,
      mode:'ios',
      duration:2000,
      position:'top',
      icon: icon,
      color:color
    });
    toast.present();
  }
}
