import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface colorMarker{
  color: string
  marker?: mapboxgl.Marker
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divmapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -64.46610152124906 , -31.40171443085011  ]
  
  //Array de marcadores
  markers: colorMarker[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divmapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();
    // const marker: HTMLElement =document.createElement('div');
    // marker.innerHTML = 'Hola Mundo';

    // new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
  }
  
  agregarMarker(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center).addTo(this.mapa)

    this.markers.push({
      color,
      marker: nuevoMarker
    });

    this.guardarMarkersLocalStorage();

    nuevoMarker.on('dragend', () => {
      this.guardarMarkersLocalStorage();
    })

  }

  irMarker(marker?: mapboxgl.Marker){
    this.mapa.flyTo({
      center: marker?.getLngLat()
    })
  }

  guardarMarkersLocalStorage(){
    const lngLatArr: colorMarker[] = [];

    this.markers.forEach(m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return
    }
    const lngLatArr: colorMarker[] = JSON.parse(localStorage.getItem('marcadores')! ); //el ! significa que siempre voy a tener un valor, ya que hice la validacion previa

    lngLatArr.forEach(m =>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      }).setLngLat(m.centro!)
      .addTo(this.mapa);

      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.guardarMarkersLocalStorage();
      })
  

    });
  }

  borrarMarcador(i: number){
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.guardarMarkersLocalStorage();
  }


}
