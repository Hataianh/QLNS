import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, FooterComponent],
  exports: [SidebarComponent, NavbarComponent, FooterComponent, CKEditorModule],
  imports: [CommonModule, RouterModule, CKEditorModule],
})
export class SharedModule {}
