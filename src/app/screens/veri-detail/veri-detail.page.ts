import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PhotoService } from '../../services/photo.service';

//import { RefiModalMapPage } from 'src/app/components/refi-modal-map/refi-modal-map.page';
import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-veri-detail',
  templateUrl: './veri-detail.page.html',
  styleUrls: ['./veri-detail.page.scss'],
})
export class VeriDetailPage implements OnInit {
  getdata = {};

  constructor() {
    this.getdata = {
      refi_usuario: 'asdfasdfasdf',
      refi_fecha: 'fecha',
    };
  }

  ngOnInit() {}
}
