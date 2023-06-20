import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../core/authentication/authentication.service';
@Component({
  selector: 'app-xacminh-email',
  templateUrl: './xacminh-email.component.html',
  styleUrls: ['./xacminh-email.component.css'],
})
export class XacminhEmailComponent implements OnInit {
  loading = true;
  error: string | null = null;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}
  ngOnInit(): void {
    // Trích xuất giá trị email từ URL

    const email = this.route.snapshot.queryParamMap.get('email')!;
    console.log(email);
    //Gọi phương thức ConfirmEmail trong AuthenticationService để xác minh email
    this.authenticationService.confirmEmail(email).subscribe(
      () => {
        // Xác minh email thành công
        this.loading = false;
        this.success = true;
      },
      (error) => {
        // Xác minh email không thành công
        this.loading = false;
        this.error = error;
        console.log(error);
      }
    );
  }
}
