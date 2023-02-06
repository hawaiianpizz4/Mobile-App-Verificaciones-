import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ModalInfoPage } from 'src/app/components/modal-info/modal-info.page';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: number;
  getdata=[];
  cedula:string;
  operacion:string;
  gestor:string;

  constructor(private activatedRoute: ActivatedRoute, 
    private toastCtrl: ToastController, private modalCtrl : ModalController,private navCtrl : NavController) {
      this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    const users = JSON.parse(localStorage.getItem("storage"));
    const v = Object.entries(users);
    const Total: any = [];
    v.map((m) => {
      Total.push(m[1]);
    });
    this.getdata = Total.find(e=>e.numeroCredito == this.id);
    if(!this.getdata){
      this.presentToast("Error, El usuario no se pudo encontrar");
      this.redirect();
    }
      
   }

  ngOnInit() {
  } 
  
  redirect (){
    this.navCtrl.navigateForward('home/listing');
  }
  async openModal(cedula:string,operacion:string,gestor:string){
    const modal = await this.modalCtrl.create({
      component:ModalInfoPage,
      componentProps:{
        cedula: cedula,
        operacion:operacion,
        gestor:gestor
      }
    });
    await modal.present();
  }

  async presentToast(mensaje){
    const toast = await this.toastCtrl.create({
      message:mensaje,
      mode:'ios',
      duration:2000,
      position:'top',
      icon: 'alert-circle-outline',
      color:"danger"
    });
    toast.present();
  }

}
