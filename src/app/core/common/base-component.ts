import { Injector, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
export class BaseComponent {
  public _renderer: any;
  public _route: ActivatedRoute;
  public _api: ApiService;
  public page: any = 1;
  public pageSize: any = 10;
  public totalItem: any;
  public nhanvien: any;
  public selectedNhanVien: any[];
  public nhanVienList: any[];
  public NVdropdownSettings: IDropdownSettings;
  public tongNv: number;
  constructor(injector: Injector) {
    this._renderer = injector.get(Renderer2);
    this._route = injector.get(ActivatedRoute);
    this._api = injector.get(ApiService);
    this.NVdropdownSettings = {
      singleSelection: true,
      idField: 'maNhanVien',
      textField: 'hoTen',
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'Không có dữ liệu',
      closeDropDownOnSelection: true,
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  public loadNhanVienList() {
    this._api.get('/api/nhanvien/get-nhanvien').subscribe((res: any[]) => {
      this.nhanVienList = res;
      console.log(res);
    });
  }
  public loadScripts(...list: string[]) {
    list.forEach((x) => {
      this.renderExternalScript(x).onload = () => {};
    });
  }
  public renderExternalScript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this._renderer.appendChild(document.body, script);
    return script;
  }
  public formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  public getShowingEntries(): string {
    const startIndex = (this.page - 1) * this.pageSize + 1;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.totalItem);
    return `Showing ${startIndex} to ${endIndex} of ${this.totalItem} entries`;
  }
}
