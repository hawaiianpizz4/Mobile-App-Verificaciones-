import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalInfoPage } from 'src/app/components/modal-info/modal-info.page';

import { CartItem } from 'src/app/models/cart-item.model';
import { Food } from 'src/app/models/food.model';
import { CartService } from 'src/app/services/cart.service';
import { FoodServices } from 'src/app/services/food.service';


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

  constructor(private activatedRoute: ActivatedRoute, private foodService: FoodServices, 
    private cartService: CartService, private toastCtrl: ToastController, private modalCtrl : ModalController) {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    
    // this.foodService.getDatos(JSON.parse(localStorage.getItem("user"))).subscribe(data=>{
    //   this.getdata= data.find((e:any)=>e.cedulaCliente == this.id.toString());
    // })
    const users = JSON.parse(localStorage.getItem("storage"));
    const v = Object.entries(users);
    const Total: any = [];
    v.map((m) => {
      Total.push(m[1]);
    });
    this.getdata = Total.find(e=>e.cedulaCliente === this.id.toString());
   }

  ngOnInit() {

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

  async presentToast(){
    const toast = await this.toastCtrl.create({
      message:'Food add to cart',
      mode:'ios',
      duration:1000,
      position:'top',
    });
    toast.present();
  }

}
