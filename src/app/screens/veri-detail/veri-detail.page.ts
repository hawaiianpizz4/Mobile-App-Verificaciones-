import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit, NgZone } from '@angular/core';

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
import { ElementRef, ViewChild } from '@angular/core';

import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-veri-detail',
  templateUrl: './veri-detail.page.html',
  styleUrls: ['./veri-detail.page.scss'],
})
export class VeriDetailPage implements OnInit {
  getdata = {};
  map;
  infoPoss = [];
  status: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private ngZone: NgZone,
    private _http: HttpClient,
    public photoService: PhotoService,
    private _services: dataService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {
    this.getdata = {
      nombre_gestor: ' Juan Perez',
      fecha_actual: ' 15/02/2023',
      nombre_tienda: ' Orve Condado',
      nombre_cliente: ' Maria Sanchez',
      numero_cedula: ' 1717830705',
      codigo: ' IDCMS',

      tipo_vivienda: 'Propia',
      persona_verifica: 'Danilo Carrera',
      residencia_minima: 'Si',
      local_terreno: 'Propia',

    };
  }

  ngOnInit() {

    this.initMap();

  }


initMap() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg';
  this.map = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-79.4698468, -1.0037841],
    zoom: 18,
  });
  // Add the control to the map.
  this.map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );

  // Create a default Marker and add it to the map.
  const marker = new mapboxgl.Marker({
    draggable: true,
  })
    .setLngLat([-79.4698468, -1.0037841])
    .addTo(this.map);

  const coordinates = document.getElementById('coordinates');

  function onDragEnd() {
    const lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitud: ${lngLat.lng}<br />Latitud: ${lngLat.lat}`;
  }

  marker.on('dragend', () => {
    //mostrar coordenadas
    const features = this.map.queryRenderedFeatures(marker._pos);
    const lngLat = marker.getLngLat();
    onDragEnd();
    console.log(features[0].properties.name);
    this._services
      .getCurrentPoss(lngLat.lng, lngLat.lat, mapboxgl.accessToken)
      .subscribe(
        (data) => {
          this.infoPoss = data;
          console.log(this.infoPoss);
        },
        (error) => {
          console.log(error);
        }
      );
  });
}
}
