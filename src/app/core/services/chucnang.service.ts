import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IChucnang } from '../models/IChucnang';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ChucnangService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getChucnang(): Observable<IChucnang[]> {
    return this._http.get<IChucnang[]>(
      this.host + '/api/chucnang/get-chucnang'
    );
  }
  public getDropDownText(maChucNang: any, object: any) {
    const cnObj = _.filter(object, function (o: { maChucNang: any }) {
      return _.includes(maChucNang, o.maChucNang);
    });
    return cnObj;
  }
}
