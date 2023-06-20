import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IPhongban } from '../models/IPhongban';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PhongbanService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getPhongban(): Observable<IPhongban[]> {
    return this._http.get<IPhongban[]>(
      this.host + '/api/phongban/get-phongban'
    );
  }
  public getDropDownText(maPhongBan: any, object: any) {
    const pbObj = _.filter(object, function (o: { maPhongBan: any }) {
      return _.includes(maPhongBan, o.maPhongBan);
    });
    return pbObj;
  }
}
