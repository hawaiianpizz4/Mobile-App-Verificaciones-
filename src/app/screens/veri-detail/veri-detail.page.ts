import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit, NgZone, Input } from '@angular/core';

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
  @Input() getdata;

  // getdata = {};
  map;
  infoPoss = [];
  status: boolean;
  address: string;
  public photosPlanilla: UserPhoto[];

dataForm: FormGroup;



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

        "id": 70,
        "cedulaCliente": "3123123131",
        "nombreCliente": "JUAN PEREZ",
        "codigoVerificacion": "",
        "direccionDomiciliaria": "07300 Inca, Islas Baleares, España",
        "tipoVivienda": "",
        "personaQuienRealizaLaVerificacion": "",
        "residenciaMinimaTresMeses": "",
        "localTerrenoPropio": "",
        "localTerrenoArrendado": "",
        "planillaServicioBasico": "",
        "planillaServicioBasicoImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/PLANILLA - 3123123131 - 3D285104-620A-6D22-3164-00261DAC3714",
        "seguridadPuertasVentanas": "",
        "muebleriaBasica": "",
        "materialCasa": "",
        "periodicidadActividadesLaborales": "",
        "confirmacionInfoVecinos": "",
        "nombreInfoVecino": "",
        "celularInfoVecino": "",
        "estabilidadLaboraSeisMesesImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/ESTABILIDAD - 3123123131 - 56E6AD8D-2BAD-3563-24F9-62476D4D9585 - 1.png",
        "facturasProveedoresUltimosTresMesesImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/FACTURAS_PROV - 3123123131 - D10ACE84-0DD8-B88F-D418-82473AC5F404 - 1.png",
        "fachadaDelNegocioImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/NEGO_EXTERIOR - 3123123131 - 7BE67B60-A124-BE98-4C17-B9A1C420F774 - 1.png",
        "interiorDelNegocioImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/NEGO_INTERIOR - 3123123131 - FD4D9380-1B2C-42A1-7E7C-0C705C1E59C8 - 1.png",
        "clienteDentroDelNegocioImagen": "http://200.7.249.21:90/VerificacionesFisicas/APP_Cobranzas_Fotos/Verificacion/JUAN PEREZ/CLIENTE_NEGO_INTERIOR - 3123123131 - DB32A099-7F05-9104-84BD-25E0433B58EC - 1.png",
    }

  console.log(this.getdata);


  this.dataForm = new FormGroup
  ({
    nombre_gestor: new FormControl(this.getdata?.nombreGestor ?? ''),

    fechaverificacion: new FormControl(''),
    vf_nombre_tienda: new FormControl(''),
    nombreCliente: new FormControl(''),
    cedulaCliente: new FormControl(''),
    tipoVivienda: new FormControl(''),
    personaQuienRealizaLaVerificación: new FormControl(''),
    residenciaMinimaTresMeses: new FormControl(''),
    localTerrenoPropio: new FormControl(''),
    localTerrenoArrendado: new FormControl(''),
    planillaServicioBasico: new FormControl(''),
    planillaServicioBasicoImagen: new FormControl(''),
    seguridadPuertasVentanas: new FormControl(''),
    muebleriaBasica: new FormControl(''),
    materialCasa: new FormControl(''),
    periodicidadActividadesLaborales: new FormControl(''),
    confirmacionInfoVecinos: new FormControl(''),
    nombreInfoVecino: new FormControl(''),
    celularInfoVecino: new FormControl(''),
    estabilidadLaboraSeisMesesImagen: new FormControl(''),



   // nombre_gestor: new FormControl(this.getdata["nombreGestor"], []),
    // fechaverificacion: new FormControl(this.getdata["fechaverificacion"]),
    // vf_nombre_tienda: new FormControl(this.getdata["vf_nombre_tienda"]),
    // nombreCliente: new FormControl(this.getdata["nombreCliente"]),
    // cedulaCliente: new FormControl(this.getdata["cedulaCliente"]),
    // tipoVivienda: new FormControl(this.getdata["tipoVivienda"]),
    // personaQuienRealizaLaVerificación: new FormControl(this.getdata["personaQuienRealizaLaVerificación"]),
    // residenciaMinimaTresMeses: new FormControl(this.getdata["residenciaMinimaTresMeses"]),
    // localTerrenoPropio: new FormControl(this.getdata["localTerrenoPropio"]),
    // localTerrenoArrendado: new FormControl(this.getdata["localTerrenoArrendado"]),
    // planillaServicioBasico: new FormControl(this.getdata["planillaServicioBasico"]),
    // planillaServicioBasicoImagen: new FormControl(this.getdata["planillaServicioBasicoImagen"]),
    // seguridadPuertasVentanas: new FormControl(this.getdata["seguridadPuertasVentanas"]),
    // muebleriaBasica: new FormControl(this.getdata["muebleriaBasica"]),
    // materialCasa: new FormControl(this.getdata["materialCasa"]),
    // periodicidadActividadesLaborales: new FormControl(this.getdata["periodicidadActividadesLaborales"]),
    // confirmacionInfoVecinos: new FormControl(this.getdata["confirmacionInfoVecinos"]),
    // nombreInfoVecino: new FormControl(this.getdata["nombreInfoVecino"]),
    // celularInfoVecino: new FormControl(this.getdata["celularInfoVecino"]),
    // estabilidadLaboraSeisMesesImagen: new FormControl(this.getdata["estabilidadLaboraSeisMesesImagen"]),



  })






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
