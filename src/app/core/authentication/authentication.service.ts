import { environment } from './../../../environments/environment';
import { User } from './../../entities/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SweetAlertService } from '../services/SweetAlert.service';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private sweetAlertService: SweetAlertService
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user') || '{}')
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value && this.userSubject.value.email
      ? this.userSubject.value
      : null;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.BASE_API}/api/user/authenticate`, {
        email,
        password,
      })
      .pipe(
        map((user) => {
          //Kiểm tra trường XacMinhEmail và thực hiện các hành động liên quan
          if (user.xacMinhEmail == false) {
            this.sendEmailVerification(user.email);
            this.sweetAlertService.showInfoAlert(
              'Thông tin',
              'Trước tiên, hãy xác minh Email của bạn!'
            );
          } else {
            window.location.reload();

            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
          }
        }),
        catchError((error) => {
          console.log(error);

          // Kiểm tra nếu là lỗi đã đăng ký nghỉ hoặc không thể chấm công trong ngày nghỉ
          let errorMessage = 'Đã xảy ra lỗi khi đăng nhập.';
          if (error.status === 400) {
            errorMessage = error.error;
          }
          Swal.fire('Lỗi', errorMessage, 'error');
          return throwError(error);
        })
      );
  }
  sendEmailVerification(email: string) {
    return this.http.post<any>(
      `${environment.BASE_API}/api/user/send-email-verification`,
      {
        email,
      }
    );
  }
  confirmEmail(email: string) {
    return this.http.post<any>(
      `${environment.BASE_API}/api/user/confirm-email`,
      {
        email,
      }
    );
  }
  forgotPassword(email: string) {
    return this.http.post<any>(
      `${environment.BASE_API}/api/user/forgot-password`,
      { email }
    );
  }

  resetPassword(email: string, ResetPasswordCode: string, newPassword: string) {
    return this.http.post<any>(
      `${environment.BASE_API}/api/user/reset-password`,
      { email, ResetPasswordCode, newPassword }
    );
  }
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
