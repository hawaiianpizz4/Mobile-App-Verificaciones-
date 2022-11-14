import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Food } from 'src/app/models/food.model';
import { FoodServices } from 'src/app/services/food.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  categories: Category[]=[];
  foods : Food[]=[];
  getdata:any[]=[];
  public results:any[] = [];
  constructor(private foodService:FoodServices, private router: Router, private _services: FoodServices) {
    this._services.getDatos<any[]>("").subscribe(data=>{
      this.getdata=data
    })
   }

  ngOnInit() {
    this.getCategories();
    this.foods = this.foodService.getFoods();
  }

  getCategories(){
    this.categories=[
      {
        id:1,
        label:'All',
        image: 'assets/images/imagen.png',
        active:true
      },
      {
        id:1,
        label:'All1',
        image: 'assets/images/imagen.png',
        active:false
      }
    ]
  }

  goToDetailPage(id:number){
    this.router.navigate(['detail',id]);
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    this._services.getDatos<any[]>("").subscribe(data=>{
      this.results = data.filter((e:any)=>e.cedulaCliente.includes(query));
    })
  }
}
