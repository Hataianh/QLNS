import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public user: any;
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
  }
  Logout() {
    this.authenticationService.logout();
  }
}
