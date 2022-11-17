import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Category } from 'src/app/models/category.model';
import { Food } from 'src/app/models/food.model';
import { FoodServices } from 'src/app/services/food.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  categories: Category[] = [];
  foods: Food[] = [];
  getdata = [];
  public results: any[] = [];
  constructor(
    private foodService: FoodServices,
    private router: Router,
    private _services: FoodServices,
    private _http: HttpClient,
    private alertController: AlertController
  ) {
    if (!localStorage.getItem('storage')) {
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
    } else {
      this.getdata = JSON.parse(localStorage.getItem('storage'));
    }
  }

  ngOnInit() {
    // this.getCategories();
    const user = localStorage.getItem('user');
    !user ? this.presentAlert() : console.log('existe');
    this.foods = this.foodService.getFoods();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Porfavor ingresa tu usuario',
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
            setTimeout(() => {
              window.location.reload();
            }, 100);
          },
        },
      ],
    });

    await alert.present();
  }

  getCategories() {
    this._http
      .get<any>('https://rickandmortyapi.com/api/character')
      .subscribe((res) => {
        console.log(res);
        this.categories = res.results;
      });
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
    this.results = Total.filter(e=>e.cedulaCliente.includes(query));
  }
}
