import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { INhanvien } from '../models/INhanvien';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class NhanvienService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getNhanvien(): Observable<INhanvien[]> {
    return this._http.get<INhanvien[]>(
      this.host + '/api/nhanvien/get-nhanvien'
    );
  }
  public getDropDownText(maNhanVien: any, object: any) {
    const nvObj = _.filter(object, function (o: { maNhanVien: any }) {
      return _.includes(maNhanVien, o.maNhanVien);
    });
    return nvObj;
  }
}
