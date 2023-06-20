import { AuthenticationService } from './../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { catchError, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public frmLogin: FormGroup;
  public submitted = false;
  public loading = false;
  public error = '';
  public returnUrl: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.frmLogin = new FormGroup({
      txt_email: new FormControl('', [Validators.required]),
      txt_password: new FormControl('', [Validators.required]),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email() {
    return this.frmLogin.get('txt_email')!;
  }
  get password() {
    return this.frmLogin.get('txt_password')!;
  }
  public Login(vl: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmLogin.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(vl.txt_email, vl.txt_password)
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
      )
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        }

      );
  }
}
