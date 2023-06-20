import { environment } from './../../../environments/environment';
import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.BASE_API);
        if (isLoggedIn && isApiUrl && request.url.indexOf('api/upload/upload-single') == -1) {
            request = request.clone({
                setHeaders: {
                    'Content-Type' : 'application/json; charset=utf-8',
                    'Accept'       : 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  }
            });
        } else if (isLoggedIn && isApiUrl && request.url.indexOf('api/upload/upload-single') >=0) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${user.token}`
                  }
            });
        }

        return next.handle(request);
    }

     
}