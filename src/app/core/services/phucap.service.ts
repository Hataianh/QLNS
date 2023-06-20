import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IPhucap } from '../models/IPhucap';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PhuCapService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getPhucap(): Observable<IPhucap[]> {
    return this._http.get<IPhucap[]>(this.host + '/api/phucap/get-phucap');
  }
  public getDropDownText(maPhuCap: any, object: any) {
    const pcObj = _.filter(object, function (o: { maPhuCap: any }) {
      return _.includes(maPhuCap, o.maPhuCap);
    });
    return pcObj;
  }
}
