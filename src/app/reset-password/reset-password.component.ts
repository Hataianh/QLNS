import { AuthenticationService } from './../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import MatchValidation from 'src/app/core/helpers/must-match.validator';
import { SweetAlertService } from '../core/services/SweetAlert.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  public frmReset: FormGroup;
  submitted: boolean;
  loading: boolean;
  error: any;
  public returnUrl: string;
  email: string;
  ResetPasswordCode: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.ResetPasswordCode = params['ResetPasswordCode'];
    });
    this.frmReset = new FormGroup(
      {
        txt_newPassword: new FormControl('', [this.pwdCheckValidator]),
        txt_repassword: new FormControl('', [Validators.required]),
      },
      {
        validators: [
          MatchValidation.match('txt_newPassword', 'txt_repassword'),
        ],
      }
    );
  }
  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {}
  get newPassword() {
    return this.frmReset.get('txt_newPassword')!;
  }
  get repassword() {
    return this.frmReset.get('txt_repassword')!;
  }
  public Reset(vl: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmReset.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .resetPassword(this.email, this.ResetPasswordCode, vl.txt_newPassword)
      .pipe(
        catchError((error) => {
          this.error = error;
          this.loading = false;
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
          console.log(data);
          this.sweetAlertService.showSuccessAlert(
            'Thành công',
            'Đặt lại mật khẩu thành công!'
          );
          this.router.navigate(['/login']);
        },

      );
  }
  public pwdCheckValidator(control: any) {
    var filteredStrings = { search: control.value, select: '@#!$%&*.' };
    var result = (
      filteredStrings.select.match(
        new RegExp('[' + filteredStrings.search + ']', 'g')
      ) || []
    ).join('');
    if (control.value.length < 8 || !result) {
      return { password: true };
    } else {
      return null;
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmReset.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
