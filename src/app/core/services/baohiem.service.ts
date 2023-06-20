import { AuthenticationService } from './../authentication/authentication.service';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBaohiem } from '../models/IBaohiem';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class BaohiemService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getBaohiem(): Observable<IBaohiem[]> {
    return this._http.get<IBaohiem[]>(this.host + '/api/baohiem/get-baohiem');
  }
  public getDropDownText(maBaoHiem: any, object: any) {
    const bhObj = _.filter(object, function (o: { maBaoHiem: any }) {
      return _.includes(maBaoHiem, o.maBaoHiem);
    });
    return bhObj;
  }
}
