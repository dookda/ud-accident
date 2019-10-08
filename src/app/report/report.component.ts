import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnDestroy, OnInit {

  public dtOptions: DataTables.Settings = {};
  public persons: any;
  public dtTrigger = new Subject();

  public accForm: FormGroup;
  public formData: any;

  gid?: any;
  firstName?: any;
  lastName?: any;
  idCard?: any;
  age?: any;
  sex?: any;
  accDate?: any;
  accTime?: any;
  accPlace?: any;
  x?: any;
  y?: any;
  vehicle?: any;
  injuryType?: any;
  alcohol?: any;
  behaviour?: any;
  toHospital?: any;
  deathInfo?: any;
  transferType?: any;
  transferBy?: any;
  deathDate?: any;
  deathTime?: any;
  geom?: any;

  constructor(
    public service: ServiceService,
    public http: HttpClient,
    public router: Router,
    public spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinner.show(undefined, {
      type: 'square-jelly-box',
      size: 'medium',
      color: 'orange',
      fullScreen: false
    });
    this.createTable();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  createTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      language: {
        emptyTable: 'ไม่พบข้อมูล',
        info: 'รายการที่ _START_ ถึง _END_ ของ _TOTAL_ ',
        search: 'ค้นหา:',
        lengthMenu: 'แสดง _MENU_ รายการ',
      }
    };

    this.http.get('http://www.cgi.uru.ac.th:3000/accident/get/').subscribe((res: any) => {
      this.persons = res.data;
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  editData(p: any) {
    this.router.navigateByUrl('edit', { state: p });

  }

  addData(p: any) {
    this.router.navigateByUrl('add', { state: p });
  }

  deleteData(p: any) {
    console.log(p);
    this.service.deleteData(p).then((r: any) => {
      console.log(r);
      if (r) {
        // alert(`ลบข้อมูล ${p.first_name}`);
        location.reload();
      }
    });
  }

  showDetail(p: any) {
    this.gid = p.gid;
    this.firstName = p.first_name;
    this.lastName = p.last_name;
    this.idCard = p.id_card;
    this.age = p.age;
    this.sex = p.sex;
    this.accDate = p.acc_date;
    this.accTime = p.acc_time;
    this.accPlace = p.acc_place;
    this.x = p.x;
    this.y = p.y;
    this.vehicle = p.vehicle;
    this.injuryType = p.injury_type;
    this.alcohol = p.alcohol;
    this.behaviour = p.behaviour;
    this.toHospital = p.to_hospital;
    this.deathInfo = p.death_info;
    this.transferType = p.transfer_type;
    this.transferBy = p.transfer_by;
    this.deathDate = p.death_date;
    this.deathTime = p.death_time;
    this.geom = p.geom;
  }

  reRender(): void {

    // this.dtTrigger.unsubscribe();
    location.reload();
  }


}

export class Coord {
  lat?: number;
  lon?: number;
}


