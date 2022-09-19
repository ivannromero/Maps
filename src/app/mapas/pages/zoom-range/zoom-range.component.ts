import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%; height: 100%;
    }

    .row{
      background-color: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 50px;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divmapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -64.46610152124906 , -31.40171443085011  ]

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{})
    this.mapa.off('zoomend', ()=>{})
    this.mapa.off('move', ()=>{})
  }

  ngAfterViewInit(): void {
      this.mapa = new mapboxgl.Map({
        container: this.divmapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.center,
        zoom: this.zoomLevel
      });

      //se crea el evento en donde se setea el zoom de las funciones con el zoom actual. 
      this.mapa.on('zoom', (ev)=>{
        this.zoomLevel = this.mapa.getZoom();
      });

      this.mapa.on('zoomend', (ev)=>{
        if(this.mapa.getZoom() > 18){
          this.mapa.zoomTo(18);
        }
      });

      //Movimiento del mapa
      this.mapa.on('move', (ev)=>{
        const target = ev.target;
        const {lng, lat}= target.getCenter()
        this.center = [lng , lat];
      });
    }

  zoomOut() {
    this.mapa.zoomOut();
    this.zoomLevel = this.mapa.getZoom();

  }

  zoomIn() {
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }

  zoomCambio(value: string){
    this.mapa.zoomTo(Number(value));
  }
}
