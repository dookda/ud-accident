import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MarkerService } from '../marker.service';
// import { EChartOption } from 'echarts';

// HighchartsExporting(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public persons: any;
  public dtTrigger = new Subject();
  public map: any;
  public data: any;

  // public chartTam: EChartOption;
  // public chartMonth: EChartOption;
  // public chartTime: EChartOption;
  // public chartAge: EChartOption;
  // public chartSex: EChartOption;
  // public chartVehicle: EChartOption;
  // public chartSafty: EChartOption;
  // public chartAlcohol: EChartOption;

  constructor(
    public service: ServiceService,
    public http: HttpClient,
    public router: Router,
    public spinner: NgxSpinnerService,
    public markerService: MarkerService
  ) {

  }

  ngOnInit() {
    this.spinner.show(undefined, {
      type: 'square-jelly-box',
      size: 'medium',
      color: 'orange',
      fullScreen: false
    });
    this.loadMap();
    // this.createChart();
  }

  showDetail(p: any) {
    // console.log(p);
  }

  async loadMap() {
    this.map = new L.Map('map', {
      center: [17.707829, 100.002905],
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

    await this.loadData();

  }

  loadData() {
    let marker: any;

    const redIcon = L.icon({
      iconUrl: this.markerService.redIcon,
      iconSize: [32, 32],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    this.service.getData().then((res: any) => {
      this.data = res.data;
      if (marker) {
        this.map.removeLayer(marker);
      }

      this.data.forEach(async (r: any) => {
        const latlng = L.latLng(r.x, r.y);
        // console.log(r);

        marker = L.marker(latlng, { icon: redIcon, iconName: 'strmSta' });

        marker.bindPopup(`วันที่เกิดเหตุ: ${r.accdate} <br>
            พาหนะ: ${r.vehicle}<br>
            แอลกอฮอล์: ${r.alcohol}<br>
            พฤติกรรม: ${r.behaviour}<br>
            `
        ).openPopup();
        marker.addTo(this.map);

        this.spinner.hide();
      });

      // this.map.setView(this.latlon, 16, { animation: true });
    });
  }

  // createChart() {
  //   this.chartTam = {
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'line'
  //     }]
  //   };

  //   this.chartMonth = {
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'bar'
  //     }]
  //   };

  //   this.chartTime = {
  //     title: {
  //       text: 'xxxxx',
  //       subtext: 'xx'
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow'
  //       }
  //     },
  //     legend: {
  //       data: ['2011年', '2012年']
  //     },
  //     grid: {
  //       left: '3%',
  //       right: '4%',
  //       bottom: '3%',
  //       containLabel: true
  //     },
  //     xAxis: {
  //       type: 'value',
  //       boundaryGap: [0, 0.01]
  //     },
  //     yAxis: {
  //       type: 'category',
  //       data: ['a', 'b', 'c', 'd', 'e', 'f']
  //     },
  //     series: [
  //       {
  //         name: '2011',
  //         type: 'bar',
  //         data: [18203, 23489, 29034, 104970, 131744, 630230]
  //       },
  //       {
  //         name: '2012',
  //         type: 'bar',
  //         data: [19325, 23438, 31000, 121594, 134141, 681807]
  //       }
  //     ]
  //   };

  //   this.chartAge = {
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b}: {c} ({d}%)'
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       // x: 'left',
  //       data: ['a', 'b', 'c', 'd', 'e']
  //     },
  //     series: [
  //       {
  //         name: 'test',
  //         type: 'pie',
  //         radius: ['50%', '70%'],
  //         avoidLabelOverlap: false,
  //         label: {
  //           normal: {
  //             show: false,
  //             position: 'center'
  //           },
  //           emphasis: {
  //             show: true,
  //             textStyle: {
  //               fontSize: '30',
  //               fontWeight: 'bold'
  //             }
  //           }
  //         },
  //         labelLine: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         data: [
  //           { value: 335, name: 'a' },
  //           { value: 310, name: 'b' },
  //           { value: 234, name: 'c' },
  //           { value: 135, name: 'd' },
  //           { value: 1548, name: 'e' }
  //         ]
  //       }
  //     ]
  //   };

  //   this.chartSex = {
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'line'
  //     }]
  //   };

  //   this.chartVehicle = {
  //     title: {
  //       text: 'xxxxxxxx',
  //       subtext: 'xxxx',
  //       // x: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b} : {c} ({d}%)'
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       left: 'left',
  //       data: ['a', 'b', 'c', 'd', 'e']
  //     },
  //     series: [
  //       {
  //         name: '访问来源',
  //         type: 'pie',
  //         radius: '55%',
  //         center: ['50%', '60%'],
  //         data: [
  //           { value: 335, name: 'a' },
  //           { value: 310, name: 'b' },
  //           { value: 234, name: 'c' },
  //           { value: 135, name: 'd' },
  //           { value: 1548, name: 'e' }
  //         ],
  //         itemStyle: {
  //           emphasis: {
  //             shadowBlur: 10,
  //             shadowOffsetX: 0,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)'
  //           }
  //         }
  //       }
  //     ]
  //   };

  //   this.chartSafty = {
  //     title: {
  //       text: 'xxxxx',
  //       subtext: 'xxx',
  //       // x: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b} : {c} ({d}%)'
  //     },
  //     legend: {
  //       // x: 'center',
  //       // y: 'bottom',
  //       data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
  //     },
  //     // calculable: true,
  //     series: [

  //       {
  //         name: 'xxxx',
  //         type: 'pie',
  //         radius: [30, 110],
  //         center: ['75%', '50%'],
  //         roseType: 'area',
  //         data: [
  //           { value: 10, name: 'rose1' },
  //           { value: 5, name: 'rose2' },
  //           { value: 15, name: 'rose3' },
  //           { value: 25, name: 'rose4' },
  //           { value: 20, name: 'rose5' },
  //           { value: 35, name: 'rose6' },
  //           { value: 30, name: 'rose7' },
  //           { value: 40, name: 'rose8' }
  //         ]
  //       }
  //     ]
  //   };
  //   this.chartAlcohol = {
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'bar'
  //     }]
  //   };
  // }

} // endclass

class Series {
  name?: string;
  data?: number[];
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
