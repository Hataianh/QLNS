import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { RolePB, RoleBP, RoleCV } from 'src/app/entities/role';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const user = this.authenticationService.userValue;
    const roles = route.data['roles'];

    if (roles && !this.checkRoles(user, roles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  private checkRoles(user: any, roles: any[]): boolean {
    for (let i = 0; i < roles.length; i++) {
      const roleGroup = roles[i];
      if (this.checkRoleGroup(user, roleGroup)) {
        return true;
      }
    }
    return false;
  }

  private checkRoleGroup(user: any, roleGroup: any[]): boolean {
    for (let i = 0; i < roleGroup.length; i++) {
      const role = roleGroup[i];
      if (!this.checkRole(user, role)) {
        return false;
      }
    }
    return true;
  }

  private checkRole(user: any, role: any): boolean {
    const rolePB = role.rolePB || role;
    const roleBP = role.roleBP || role;
    const roleCV = role.roleCV || role;

    return (
      user.rolePB === rolePB || user.roleBP === roleBP || user.roleCV === roleCV
    );
  }
}
