import { Component, OnInit, NgZone, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { ModalController, NavController, ToastController, LoadingController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { PhotoService, UserPhoto } from '../../services/photo.service';

import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl } from '@angular/forms';

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
    this.dataForm = new FormGroup({
      myControl: new FormControl('')
    });

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

    // Crear el mapa
    const map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4698468, -1.0037841],
      pitch : 30,
      zoom: 15,

      // Asegurarse de que el mapa se dibuje completamente
      renderWorldCopies: false,
      maxBounds: [
        [-180, -90],
        [180, 90]
      ],
      scrollZoom: false,
      dragPan: false,
    });

    map.on('idle', function () {
      this.resize();
    });

    // Crear el marcador y agregarlo al mapa
    const marker = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat([-79.4698468, -1.0037841])
      .addTo(map);

    // Obtener la dirección del cliente desde getdata
    const address = this.getdata['direccionDomiciliaria'];

    // Enviar la dirección a la API de geocodificación de Mapbox
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxgl.accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        // Obtener las coordenadas del primer resultado
        const [lng, lat] = data.features[0].center;

        // Mover el marcador al resultado de la geocodificación
        marker.setLngLat([lng, lat]);

        // Centrar el mapa en las coordenadas de la geocodificación
        map.setCenter([lng, lat]);

        // Establecer el valor de la dirección del cliente en el cuadro de búsqueda
        map.on('load', () => {
          // Eliminar la opción de búsqueda del mapa
          const geocoderContainer = document.getElementsByClassName('mapboxgl-ctrl-group')[0];
          if (geocoderContainer) {
            geocoderContainer.parentNode.removeChild(geocoderContainer);
          }

          // Agregar el control de navegación al mapa
          map.addControl(new mapboxgl.NavigationControl());

          // Agregar el control de rotación al mapa
          map.addControl(
            new mapboxgl.RotateControl({
              bearingSnap: 15,
            })
          );

          // Agregar el control de escala al mapa
          map.addControl(new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
          }));

          // Agregar el marcador con la nueva dirección
          const newMarker = new mapboxgl.Marker({
            draggable: false,
          })
            .setLngLat([lng, lat])
            .addTo(map);
        });
      })
      .catch((error) => console.error(error));

    // Cambiar el estilo del mapa para que las calles sean más claras
    map.on('load', () => {
      map.setStyle('mapbox://styles/mapbox/light-v10');
    });
  }

  async showLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg,
    });
    return loading;
  }
}
