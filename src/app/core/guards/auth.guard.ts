import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    const currentPath = route.routeConfig?.path; // Lấy đường dẫn hiện tại từ ActivatedRouteSnapshot

    if (currentPath === 'xacminh-email') {
      return true; // Cho phép truy cập đường dẫn xacminh-email
    }

    if (user) {
      return true; // Người dùng đã đăng nhập, cho phép truy cập
    }

    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập và lưu đường dẫn hiện tại
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
