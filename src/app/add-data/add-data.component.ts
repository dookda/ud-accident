import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { ServiceService } from '../service.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {


  public accForm: FormGroup;
  public formData: any;
  public map: any;
  public latlon: Coord = { lat: 17.62960, lon: 100.096650 };
  public marker: any;


  // select option  
  public pro: any;
  public amp: any;
  public tam: any;

  public ampSel: any;
  public tamSel: any;



  constructor(
    public http: HttpClient,
    public fb: FormBuilder,
    public service: ServiceService,
    public route: Router
  ) {
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const time = formatDate(new Date(), 'hh:mm', 'en-US');
    console.log(time);
    this.accForm = this.fb.group({
      title_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.nullValidator],
      type: ['', Validators.nullValidator],
      id_card: ['0000000000000', Validators.nullValidator],
      age: ['00', Validators.nullValidator],
      sex: ['', Validators.nullValidator],
      acc_date: [date, Validators.nullValidator],
      acc_time: [time, Validators.nullValidator],
      acc_place: ['', Validators.nullValidator],
      amp: ['', Validators.nullValidator],
      tam: ['', Validators.nullValidator],
      x: ['', Validators.nullValidator],
      y: ['', Validators.nullValidator],
      vehicle: ['', Validators.nullValidator],
      injury_type: ['', Validators.nullValidator],
      alcohol: ['', Validators.nullValidator],
      behaviour: ['', Validators.nullValidator],
      to_hospital: ['', Validators.nullValidator],
      death_info: ['', Validators.nullValidator],
      transfer_type: ['', Validators.nullValidator],
      disputant: ['', Validators.nullValidator],
      death_date: [date, Validators.nullValidator],
      death_time: [time, Validators.nullValidator],
      geom: ['', Validators.nullValidator],
    });
  }

  ngOnInit() {
    this.loadMap();
    this.initAmp();
  }

  async loadMap() {
    this.map = new L.Map('map', {
      center: [this.latlon.lat, this.latlon.lon],
      zoom: 10
    });

    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      maxZoom: 20,
    });

    // overlay map
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const amp = L.tileLayer.wms(cgiUrl, {
      layers: 'th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const baseMap = {
      แผนที่ถนน: grod,
      แผนที่ภูมิประเทศ: gter.addTo(this.map),
      แผนที่ผสม: ghyb,
      แผนที่OSM: osm
    };

    const overLay = {
      ขอบเขตจังหวัด: pro.addTo(this.map),
      ขอบเขตอำเภอ: amp.addTo(this.map),
      ขอบเขตตำบล: tam.addTo(this.map),
    };

    L.control.layers(baseMap, overLay).addTo(this.map);
    await this.getLocation();
  }

  async getLocation() {
    // navigator.geolocation.getCurrentPosition((position) => {
    // this.latlon = { lat: position.coords.latitude, lon: position.coords.longitude };

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([this.latlon.lat, this.latlon.lon], {
      draggable: 'true'
    }).bindPopup('ตำแหน่งเกิดอุบัติเหตุ').addTo(this.map);

    this.marker.on('dragend', (e: any) => {
      this.latlon = { lat: e.target._latlng.lat, lon: e.target._latlng.lng };
    });
    // });
  }

  xChange(e: any) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    // console.log(e.target.value);
    this.latlon.lat = e.target.value;
    this.marker = L.marker([this.latlon.lat, this.latlon.lon], {
      draggable: 'true'
    }).bindPopup('ตำแหน่งเกิดอุบัติเหตุ').addTo(this.map);
  }

  yChange(e: any) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    // console.log(e.target.value);
    this.latlon.lon = e.target.value;

    this.marker = L.marker([this.latlon.lat, this.latlon.lon], {
      draggable: 'true'
    }).bindPopup('ตำแหน่งเกิดอุบัติเหตุ').addTo(this.map);
  }

  async onSubmit() {
    this.formData = this.accForm.value;
    this.formData.x = this.latlon.lat;
    this.formData.y = this.latlon.lon;
    this.formData.geom = (JSON.stringify(this.marker.toGeoJSON().geometry));
    this.formData.amp = this.ampSel.amp_name;
    this.formData.tam = this.tamSel.tam_name;

    // console.log(this.formData);
    await this.service.insertData(this.formData).then((res: any) => {
      if (res) {
        this.accForm.reset();
        this.gotoReport();
      }
    });
  }

  gotoReport() {
    this.route.navigateByUrl('report');
  }

  async initAmp() {
    await this.service.getAmp(53).then((res: any) => {
      this.amp = res;
    });
  }

  async selectTam() {
    await this.service.getTam(this.ampSel.ap_idn).then((res: any) => {
      this.tam = res;
    });

    await this.service.getAmpExt(this.ampSel.ap_idn).then((res: any) => {
      this.map.flyToBounds([[res[0].ymax, res[0].xmin], [res[0].ymin, res[0].xmax]]);
    });
  }

  async fitTam() {
    await this.service.getTamExt(this.tamSel.tb_idn).then((res: any) => {
      this.map.flyToBounds([[res[0].ymax, res[0].xmin], [res[0].ymin, res[0].xmax]]);
    });
  }

}

export class Coord {
  lat?: number;
  lon?: number;
}
