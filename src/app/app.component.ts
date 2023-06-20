import { ViewEncapsulation } from '@angular/compiler';
import { AfterViewChecked, Component, ElementRef } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private elementRef: ElementRef) {}
  ngAfterViewChecked() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '../assets/js/custom.min.js';
    this.elementRef.nativeElement.appendChild(s);
  }
}
