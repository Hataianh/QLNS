import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-bangcong',
  templateUrl: './bangcong.component.html',
  styleUrls: ['./bangcong.component.css'],
})
export class BangcongComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_bangcongs: any;
  public daysInMonth: number;
  public bangcong: any;
  public frmSearch: FormGroup;
  public maNhanVien: any;
  public list_nhanviens: any;
  public years: string[] = [];
  public months: { value: string; label: string }[] = [];
  thang: any;
  nam: any;
  ngay: any;
  manhanvien: any;
  constructor(
    injector: Injector,
    private sweetAlertService: SweetAlertService
  ) {
    super(injector);
    this.frmSearch = new FormGroup({
      txt_search: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.LoadData(this.pageSize);
    this.loadNhanVienList();
    this.thang = localStorage.getItem('thang') || '';
    this.nam = localStorage.getItem('nam') || '';
    this.ngay = localStorage.getItem('ngay') || '';
    // this.manhanvien = localStorage.getItem('manhanvien') || '';
    // console.log(this.manhanvien);

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i.toString());
    }
    for (let i = 12; i >= 1; i--) {
      this.months.push({ value: i.toString(), label: 'Tháng ' + i });
    }

    // Calculate the number of days in the month

    this.daysInMonth = new Date(this.nam, this.thang, 0).getDate();
  }
  getDaysInMonth(): number[] {
    return Array.from({ length: this.daysInMonth }, (_, index) => index + 1);
  }
  public BangCong() {
    this._api
      .post('/api/bangcong/loadData', {
        thang: this.thang,
        nam: this.nam,
        ngay: this.ngay,
        manhanvien: this.selectedNhanVien[0].maNhanVien,
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_bangcongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = this.list_bangcongs.length;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/bangcong/loadData', {
        thang: this.thang,
        nam: this.nam,
        ngay: this.ngay,
        // manhanvien: this.manhanvien,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_bangcongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  public LoadData(pageSize: any) {
    this._api
      .post('/api/bangcong/loadData', {
        thang: this.thang,
        nam: this.nam,
        ngay: this.ngay,
        // manhanvien: this.manhanvien,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_bangcongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public loadData() {
    this._api
      .post('/api/bangcong/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
        thang: this.thang,
        nam: this.nam,
        ngay: this.ngay,
        // manhanvien: this.manhanvien,
      })
      .subscribe((res) => {
        this.list_bangcongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  ngAfterViewInit() {
    this.loadScripts('/assets/ckeditor/ckeditor.js');
  }

  setThang(thang: any) {
    this.thang = thang;
    localStorage.setItem('thang', thang);
    this.LoadData(this.pageSize);
  }
  setNam(nam: any) {
    this.nam = nam;
    localStorage.setItem('nam', nam);
    this.LoadData(this.pageSize);
  }
  setNgay(ngay: any) {
    this.ngay = ngay;
    localStorage.setItem('ngay', ngay);
    this.LoadData(this.pageSize);
  }
  setNv(manhanvien: any) {
    this.manhanvien = manhanvien;
    localStorage.setItem('manhanvien', manhanvien);
    this.LoadData(this.pageSize);
  }
}
