import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit, NgZone, Input } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { forwardGeocode } from '@mapbox/mapbox-sdk/services/geocoding';
import { ModalController, NavController, ToastController, LoadingController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PhotoService, UserPhoto } from '../../services/photo.service';
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
  @Input() id;
  getdata;
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
    this.getdata = localStorage.getItem('detalleVeri');
    this.getdata = JSON.parse(localStorage.getItem('detalleVeri'));
  }

  ngOnInit() {
    this.initMap();
    this.cargarFormulario();
  }

  cargarFormulario() {
    console.log(this.getdata['nombreGestor']);
    this.dataForm = new FormGroup({
      nombreGestor: new FormControl(this.getdata['nombreGestor'], []),
      fechaverificacion: new FormControl(this.getdata.fechaverificacion, []),
      vf_nombre_tienda: new FormControl(this.getdata.vf_nombre_tienda, []),
      nombreCliente: new FormControl(this.getdata.nombreCliente, []),
      cedulaCliente: new FormControl(this.getdata.cedulaCliente, []),
      direccionDomiciliaria: new FormControl(this.getdata.direccionDomiciliaria, []),
      tipoVivienda: new FormControl(this.getdata.tipoVivienda, []),
      personaQuienRealizaLaVerificación: new FormControl(this.getdata.personaQuienRealizaLaVerificación, []),
      residenciaMinimaTresMeses: new FormControl(this.getdata.residenciaMinimaTresMeses, []),
      localTerrenoPropio: new FormControl(this.getdata.localTerrenoPropio, []),
      localTerrenoArrendado: new FormControl(this.getdata.localTerrenoArrendado, []),
      planillaServicioBasico: new FormControl(this.getdata.planillaServicioBasico, []),
      planillaServicioBasicoImagen: new FormControl(this.getdata.planillaServicioBasicoImagen, []),
      seguridadPuertasVentanas: new FormControl(this.getdata.seguridadPuertasVentanas, []),
      muebleriaBasica: new FormControl(this.getdata.muebleriaBasica, []),
      materialCasa: new FormControl(this.getdata.materialCasa, []),
      periodicidadActividadesLaborales: new FormControl(this.getdata.periodicidadActividadesLaborales, []),
      confirmacionInfoVecinos: new FormControl(this.getdata.confirmacionInfoVecinos, []),
      nombreInfoVecino: new FormControl(this.getdata.nombreInfoVecino, []),
      celularInfoVecino: new FormControl(this.getdata.celularInfoVecino, []),
      estabilidadLaboraSeisMesesImagen: new FormControl(this.getdata.estabilidadLaboraSeisMesesImagen, []),
      facturasProveedoresUltimosTresMesesImagen: new FormControl(this.getdata.facturasProveedoresUltimosTresMesesImagen, []),
      fachadaDelNegocioImagen: new FormControl(this.getdata.fachadaDelNegocioImagen, []),
      interiorDelNegocioImagen: new FormControl(this.getdata.interiorDelNegocioImagen, []),
      clienteDentroDelNegocioImagen: new FormControl(this.getdata.clienteDentroDelNegocioImagen, []),
      clienteFueraDelNegocioImagen: new FormControl(this.getdata.clienteFueraDelNegocioImagen, []),
      imagen_tituloPropiedad: new FormControl(this.getdata.tituloPropiedaGaranteOCodeudorImagen, []),
      impuestoPredialImagen: new FormControl(this.getdata.impuestoPredialImagen, []),
      respaldoIngresosImagen: new FormControl(this.getdata.respaldoIngresosImagen, []),
      certificadoLaboralImagen: new FormControl(this.getdata.certificadoLaboralImagen, []),
      interiorDomicilioImagen: new FormControl(this.getdata.interiorDomicilioImagen, []),
    });
  }

  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg';

    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4698468, -1.0037841],
      zoom: 18,
      scrollZoom: true, // Impedir el zoom con la rueda del ratón
      dragPan: false, // Impedir que el usuario mueva el mapa
    });

    const marker = new mapboxgl.Marker({
      draggable: false, // Eliminar la capacidad de arrastrar el marcador
    })
      .setLngLat([-79.4698468, -1.0037841])
      .addTo(this.map);

    // Obtener la dirección del cliente desde getdata
    const address = this.getdata['direccion_cliente'];

    // Enviar la dirección a la API de geocodificación de Mapbox
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxgl.accessToken}`)
      .then((response) => response.json())
      .then((data) => {
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
            mapboxgl: mapboxgl,
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
              this.map.fitBounds([ne, sw], { padding: 50 });
            }
            if (event && event.target && event.target._inputEl && event.target._inputEl.style) {
              event.target._inputEl.style.cursor = 'default';
            }
          });
        });
      })
      .catch((error) => console.error(error));
  }

  async showLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg,
    });
    return loading;
  }
}
