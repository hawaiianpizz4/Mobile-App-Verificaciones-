import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map;
  infoPoss = [];
  constructor(
    private _services: dataService,
  ) {}

  ngOnInit() {
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

   
 

    marker.on('dragend',()=>{
      //mostrar coordenadas
      const features = this.map.queryRenderedFeatures(marker._pos);
      const lngLat = marker.getLngLat();
      onDragEnd();
      console.log(features[0].properties.name);
      this._services.getCurrentPoss(lngLat.lng,lngLat.lat,mapboxgl.accessToken).subscribe(
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
