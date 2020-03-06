import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    public http: HttpClient
  ) { }

  getData() {
    const url = 'https://www.rti2dss.com:3100/api/get/';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  insertData(obj: any) {
    const url = 'https://www.rti2dss.com:3100/api/insert/';
    return new Promise((resolve, reject) => {
      this.http.post(url, obj).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  updateData(obj: any) {
    const url = 'https://www.rti2dss.com:3100/api/update/';
    return new Promise((resolve, reject) => {
      this.http.post(url, obj).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  deleteData(obj: any) {
    const url = 'https://www.rti2dss.com:3100/api/delete/';
    return new Promise((resolve, reject) => {
      this.http.post(url, obj).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getPro(id: any) {
    const url = `http://www.cgi.uru.ac.th:3000/selectb/pro/${id}`;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getAmp(id: any) {
    const url = `http://www.cgi.uru.ac.th:3000/selectb/amp/${id}`;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getTam(id: any) {
    const url = `http://www.cgi.uru.ac.th:3000/selectb/tam/${id}`;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getAmpExt(id: any) {
    const url = `http://www.cgi.uru.ac.th:3000/selectb/ampext/${id}`;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getTamExt(id: any) {
    const url = `http://www.cgi.uru.ac.th:3000/selectb/tamext/${id}`;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }


}
