import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBophan } from '../models/IBophan';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class BophanService {
  public host = environment.BASE_API;
  constructor(
    private _http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public getBophan(): Observable<IBophan[]> {
    return this._http.get<IBophan[]>(this.host + '/api/bophan/get-bophan');
  }
  public getDropDownText(maBoPhan: any, object: any) {
    const bpObj = _.filter(object, function (o: { maBoPhan: any }) {
      return _.includes(maBoPhan, o.maBoPhan);
    });
    return bpObj;
  }
}
