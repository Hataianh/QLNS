import { AuthenticationService } from './../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  public frmForgot: FormGroup;
  submitted: boolean;
  loading: boolean;
  error: any;
  ngOnInit(): void {
    this.frmForgot = new FormGroup({
      txt_email: new FormControl('', [Validators.required]),
    });
  }
  constructor(
    private authenticationService: AuthenticationService,
    private sweetAlertService: SweetAlertService
  ) {}
  get email() {
    return this.frmForgot.get('txt_email')!;
  }
  public Forgot(vl: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmForgot.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.forgotPassword(vl.txt_email).pipe(
      catchError((error) => {
        console.log(error);


        let errorMessage = 'Đã xảy ra lỗi.';
        if (error.status === 400) {
          errorMessage = error.error;
        }
        Swal.fire('Lỗi', errorMessage, 'error');
        return throwError(error);
      })
    ).subscribe(
      (data) => {
        this.sweetAlertService.showSuccessAlert(
          'Thành công',
          'Link đặt lại mật khẩu đã được gửi qua Email!'
        );
        console.log(data);
      },
      // (error) => {
      //   this.error = error;
      //   this.loading = false;
      //   console.log('Error:', error);
      //   let errorMessage = 'Đã xảy ra lỗi.';
      //   if (error.status === 400) {
      //     errorMessage = error.error;
      //   }
      //   Swal.fire('Lỗi', errorMessage, 'error');
      //   return throwError(error);
      // }
    );
  }
}
