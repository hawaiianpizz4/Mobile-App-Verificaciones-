import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit, NgZone } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { forwardGeocode } from '@mapbox/mapbox-sdk/services/geocoding';
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

import { PhotoService ,UserPhoto} from '../../services/photo.service';
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
  address: string;
  public photosPlanilla: UserPhoto[];

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
      codigo: ' IDCMS',
      nombre_gestor: ' Juan Perez',
      fecha_actual: ' 15/02/2023',
      nombre_tienda: ' Orve Condado',
      nombre_cliente: ' Maria Sanchez',
      numero_cedula: ' 1717830705',
      direccion_cliente:'Quicentro Sur',
      tipo_vivienda: 'Propia',
      persona_verifica: 'Maria Sanchez',
      residencia_minima: 'Si',
      localTerreno_propio:'Si',
      localTerreno_arrendado:'Si',


      planilla_servicios: 'Si',
      imagen_planilla: 'http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/PLANILLA - 3123123131 - 08944780-6882-94EA-46B9-56107F90B6A5 - 1.png',
      seguridad_puertas: 'si',
      muebleria_basica: 'si',
      material_casa: 'Bloque',
      periodicidad_actividades: 'DIARIO',
      vecino_confirm: 'Si',
      vecino_nombre: 'Danilo Carrera',
      vecino_celular: '0969838598',

    };
  }

  ngOnInit() {


    this.initMap();


  }



  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg';

    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4698468, -1.0037841],
      zoom: 18,
      scrollZoom: true, // Impedir el zoom con la rueda del ratón
      dragPan: false // Impedir que el usuario mueva el mapa
    });

    const marker = new mapboxgl.Marker({
      draggable: false, // Eliminar la capacidad de arrastrar el marcador
    }).setLngLat([-79.4698468, -1.0037841]).addTo(this.map);

    // Obtener la dirección del cliente desde getdata
    const address = this.getdata['direccion_cliente'];

    // Enviar la dirección a la API de geocodificación de Mapbox
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        // Obtener las coordenadas del primer resultado
        const [lng, lat] = data.features[0].center;

        // Mover el marcador al resultado de la geocodificación
        marker.setLngLat([lng, lat]);

        // Centrar el mapa en las coordenadas de la geocodificación
        this.map.setCenter([lng, lat]);

        // Establecer el valor de la dirección del cliente en el cuadro de búsqueda
        this.map.on('load', () => {
          const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
          });
          geocoder.query(address);
          this.map.addControl(geocoder);
          geocoder.on('loading', (event) => {
            if (event && event.target && event.target._inputEl && event.target._inputEl.style) {
              event.target._inputEl.style.cursor = 'wait';
            }
          });
          geocoder.on('result', (event) => {
            if (event && event.result && event.result.bbox && event.result.bbox.length > 0) {
              const bbox = event.result.bbox;
              const ne = [bbox[2], bbox[3]];
              const sw = [bbox[0], bbox[1]];
              this.map.fitBounds([ne, sw], {padding: 50});
            }
            if (event && event.target && event.target._inputEl && event.target._inputEl.style) {
              event.target._inputEl.style.cursor = 'default';
            }
          });
        });
      })
      .catch(error => console.error(error));
  }

  async showLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg,
    });
    return loading;
  }
}
