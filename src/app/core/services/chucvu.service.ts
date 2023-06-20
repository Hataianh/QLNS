import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IChucvu } from '../models/IChucvu';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ChucvuService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getChucvu(): Observable<IChucvu[]> {
    return this._http.get<IChucvu[]>(this.host + '/api/chucvu/get-chucvu');
  }
  public getDropDownText(maChucVu: any, object: any) {
    const cvObj = _.filter(object, function (o: { maChucVu: any }) {
      return _.includes(maChucVu, o.maChucVu);
    });
    return cvObj;
  }
}
