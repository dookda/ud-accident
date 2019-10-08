import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { ServiceService } from '../service.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss']
})
export class EditDataComponent implements OnInit {


  public accForm: FormGroup;
  public formData: any;
  public map: any;
  public latlon: Coord = { lat: 17.62960, lon: 100.096650 };
  public marker: any;
  public selData: any;

  constructor(
    public fb: FormBuilder,
    public service: ServiceService,
    public route: Router
  ) {
    this.selData = this.route.getCurrentNavigation().extras.state;
    console.log(this.selData);

    // const date = formatDate(this.selData.acc_date, 'yyyy-MM-dd', 'en');
    // const time = formatDate(new Date(), 'hh:mm', 'en-US');
    // console.log(date);

    this.accForm = this.fb.group({
      first_name: [this.selData.first_name, Validators.required],
      last_name: [this.selData.last_name, Validators.nullValidator],
      id_card: [this.selData.id_card, Validators.nullValidator],
      age: [this.selData.age, Validators.nullValidator],
      sex: [this.selData.sex, Validators.nullValidator],
      acc_date: [formatDate(this.selData.acc_date, 'yyyy-MM-dd', 'en'), Validators.nullValidator],
      acc_time: [this.selData.acc_time, Validators.nullValidator],
      acc_place: [this.selData.acc_place, Validators.nullValidator],
      x: [this.selData.x, Validators.nullValidator],
      y: [this.selData.y, Validators.nullValidator],
      vehicle: [this.selData.vehicle, Validators.nullValidator],
      injury_type: [this.selData.injury_type, Validators.nullValidator],
      alcohol: [this.selData.alcohol, Validators.nullValidator],
      behaviour: [this.selData.behaviour, Validators.nullValidator],
      to_hospital: [this.selData.to_hospital, Validators.nullValidator],
      death_info: [this.selData.death_info, Validators.nullValidator],
      transfer_type: [this.selData.transfer_type, Validators.nullValidator],
      transfer_by: [this.selData.transfer_by, Validators.nullValidator],
      death_date: [formatDate(this.selData.death_date, 'yyyy-MM-dd', 'en'), Validators.nullValidator],
      death_time: [this.selData.death_time, Validators.nullValidator],
      geom: [this.selData.geom, Validators.nullValidator],
    });
  }

  ngOnInit() {
    this.loadMap();
  }


  async loadMap() {
    this.map = new L.Map('map', {
      center: [this.selData.x, this.selData.y],
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
      แผนที่ผสม: ghyb
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
    this.latlon = { lat: this.selData.x, lon: this.selData.y };

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([this.latlon.lat, this.latlon.lon], {
      draggable: 'true'
    }).bindPopup('ตำแหน่งเกิดอุบัติเหตุ').addTo(this.map);


    this.marker.on('dragend', (e: any) => {
      this.latlon = { lat: e.target._latlng.lat, lon: e.target._latlng.lng };
    });
  }

  async onSubmit() {
    this.formData = this.accForm.value;
    this.formData.gid = this.selData.gid;
    this.formData.x = this.latlon.lat;
    this.formData.y = this.latlon.lon;
    this.formData.geom = (JSON.stringify(this.marker.toGeoJSON().geometry));


    console.log(this.formData);

    await this.service.updateData(this.formData).then((res: any) => {
      if (res) {
        this.accForm.reset();
        this.gotoReport();
      }
    });
  }

  gotoReport() {
    this.route.navigateByUrl('report');
  }

}

export class Coord {
  lat?: number;
  lon?: number;
}
