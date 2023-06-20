import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NhanvienComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_nhanviens: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public frmNhanvien: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public phongban: any;
  public trinhdo: any;
  public bophan: any;
  public chucvu: any;
  public list_trinhdos: any;
  public list_chucvus: any;
  public list_bophans: any;
  public list_phongbans: any;
  public maPhongBan: any;
  public maTrinhDo: any;
  public maBoPhan: any;
  public maChucVu: any;
  public maBaoHiem: any;
  public maPhuCap: any;
  public maChucNang: any;
  public trangThai: any;
  public loaitrangthai: any;
  public nhanvienBaohiem: any;
  public selectedBaoHiem: number[];
  public baoHiemList: any[];
  public BHdropdownSettings: IDropdownSettings;
  public nhanvienPhucap: any;
  public selectedPhuCap: number[];
  public phuCapList: any[];
  public PCdropdownSettings: IDropdownSettings;
  public nhanvienChucnang: any;
  public selectedChucNang: number[];
  public chucNangList: any[];
  public CNdropdownSettings: IDropdownSettings;
  public user: any;
  constructor(
    injector: Injector,
    private sweetAlertService: SweetAlertService,
    private authenticationService: AuthenticationService
  ) {
    super(injector);
    this.frmSearch = new FormGroup({
      txt_search: new FormControl('', []),
    });
  }
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.phongban = localStorage.getItem('phongban') || '';
    this.trinhdo = localStorage.getItem('trinhdo') || '';
    this.bophan = localStorage.getItem('bophan') || '';
    this.chucvu = localStorage.getItem('chucvu') || '';
    this.loaitrangthai = localStorage.getItem('loaitrangthai') || '';
    this.LoadData(this.pageSize);
    this.loadData();
    this.loadBaoHiemList();
    this.loadPhuCapList();
    this.loadChucNangList();
    this._api.get('/api/trinhdo/get-trinhdo').subscribe((res) => {
      this.list_trinhdos = res;
      console.log(res);
    });
    this._api.get('/api/chucvu/get-chucvu').subscribe((res) => {
      this.list_chucvus = res;
      console.log(res);
    });
    this._api.get('/api/bophan/get-bophan').subscribe((res) => {
      this.list_bophans = res;
      console.log(res);
    });
    this._api.get('/api/phongban/get-phongban').subscribe((res) => {
      this.list_phongbans = res;
      console.log(res);
    });
    this.BHdropdownSettings = {
      singleSelection: false,
      idField: 'maBaoHiem',
      textField: 'loaiBaoHiem',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'Không có dữ liệu',
      closeDropDownOnSelection: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.PCdropdownSettings = {
      singleSelection: false,
      idField: 'maPhuCap',
      textField: 'tenPhuCap',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'Không có dữ liệu',
      closeDropDownOnSelection: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.CNdropdownSettings = {
      singleSelection: false,
      idField: 'maChucNang',
      textField: 'tenChucNang',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'Không có dữ liệu',
      closeDropDownOnSelection: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  exportToExcel(): void {
    const element = document.getElementById('NhanVienid') as HTMLTableElement;
    if (!element) return;

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Áp dụng font chữ Times New Roman cho toàn bộ bảng
    const font = { name: 'Times New Roman', bold: true };
    const alignment = { vertical: 'center', horizontal: 'center' };
    const range = worksheet['!ref']
      ? XLSX.utils.decode_range(worksheet['!ref'])
      : null;
    if (range) {
      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          const cell = worksheet[cellAddress];
          if (!cell) continue;

          cell.s = { ...cell.s, font, alignment };

          // Apply yellow background for the first two rows
          if (rowNum <= 1) {
            cell.s.fill = { fgColor: { rgb: 'FFFF00' } };
          }
        }
      }
    }

    // Thiết lập các thuộc tính rowspan và colspan
    worksheet['!merges'] = [
      // Các cells được merge cho hàng "Họ tên"
      { s: { r: 1, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 1, c: 3 }, e: { r: 1, c: 3 } },
      { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 5 } },
      { s: { r: 1, c: 6 }, e: { r: 1, c: 6 } },
      { s: { r: 1, c: 7 }, e: { r: 1, c: 7 } },
      { s: { r: 1, c: 8 }, e: { r: 1, c: 8 } },
      { s: { r: 1, c: 9 }, e: { r: 1, c: 9 } },
      { s: { r: 1, c: 10 }, e: { r: 1, c: 10 } },
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, 'nhanvien.xlsx');
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const workbook: XLSX.WorkBook = XLSX.read(e.target.result, {
          type: 'binary',
        });
        const worksheet: XLSX.WorkSheet =
          workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        });

        // Gửi yêu cầu import dữ liệu
        this.importNhanVien(jsonData).subscribe(
          () => {
            console.log('Import success');
          },
          (error) => {
            console.error('Import error', error);
          }
        );
      };

      reader.readAsBinaryString(file);
    }
  }
  importNhanVien(data: any[]) {
    return this._api.post('/api/nhanvien/import-nhanvien', data);
  }
  loadBaoHiemList() {
    this._api.get('/api/baohiem/get-baohiem').subscribe((res: any[]) => {
      this.baoHiemList = res;
      console.log(res);
    });
  }
  loadPhuCapList() {
    this._api.get('/api/phucap/get-phucap').subscribe((res: any[]) => {
      this.phuCapList = res;
      console.log(res);
    });
  }
  loadChucNangList() {
    this._api.get('/api/chucnang/get-chucnang').subscribe((res: any[]) => {
      this.chucNangList = res;
      console.log(res);
    });
  }

  public LoadPage(page: any) {
    this._api
      .post('/api/nhanvien/bo-loc', {
        phongban: this.phongban,
        trinhdo: this.trinhdo,
        bophan: this.bophan,
        chucvu: this.chucvu,
        loaitrangthai: this.loaitrangthai,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_nhanviens = res.data;
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
      .post('/api/nhanvien/bo-loc', {
        phongban: this.phongban,
        trinhdo: this.trinhdo,
        bophan: this.bophan,
        chucvu: this.chucvu,
        loaitrangthai: this.loaitrangthai,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_nhanviens = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public loadData() {
    this._api
      .post('/api/nhanvien/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_nhanviens = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  setPhongBan(phongban: any) {
    this.phongban = phongban;
    localStorage.setItem('phongban', phongban);
    this.LoadData(this.pageSize);
  }
  setTrinhDo(trinhdo: any) {
    this.trinhdo = trinhdo;
    localStorage.setItem('trinhdo', trinhdo);
    this.LoadData(this.pageSize);
  }
  setBoPhan(bophan: any) {
    this.bophan = bophan;
    localStorage.setItem('bophan', bophan);
    this.LoadData(this.pageSize);
  }
  setChucVu(chucvu: any) {
    this.chucvu = chucvu;
    localStorage.setItem('chucvu', chucvu);
    this.LoadData(this.pageSize);
  }
  setTrangThai(loaitrangthai: any) {
    this.loaitrangthai = loaitrangthai;
    localStorage.setItem('loaitrangthai', loaitrangthai);
    this.LoadData(this.pageSize);
  }

  get hoten() {
    return this.frmNhanvien.get('txt_hoten')!;
  }
  get gioitinh() {
    return this.frmNhanvien.get('txt_gioitinh')!;
  }
  get ngaysinh() {
    return this.frmNhanvien.get('txt_ngaysinh')!;
  }
  get cccd() {
    return this.frmNhanvien.get('txt_cccd')!;
  }
  get diachi() {
    return this.frmNhanvien.get('txt_diachi')!;
  }
  get hinhanh() {
    return this.frmNhanvien.get('txt_hinhanh')!;
  }
  get dienthoai() {
    return this.frmNhanvien.get('txt_dienthoai')!;
  }
  get email() {
    return this.frmNhanvien.get('txt_email')!;
  }
  get password() {
    return this.frmNhanvien.get('txt_password')!;
  }
  get mabophan() {
    return this.frmNhanvien.get('txt_mabophan')!;
  }
  get maphongban() {
    return this.frmNhanvien.get('txt_maphongban')!;
  }
  get machucvu() {
    return this.frmNhanvien.get('txt_machucvu')!;
  }
  get matrinhdo() {
    return this.frmNhanvien.get('txt_matrinhdo')!;
  }
  get mabaohiem() {
    return this.frmNhanvien.get('txt_mabaohiem')!;
  }
  get maphucap() {
    return this.frmNhanvien.get('txt_maphucap')!;
  }
  get machucnang() {
    return this.frmNhanvien.get('txt_machucnang')!;
  }
  get mucluong() {
    return this.frmNhanvien.get('txt_mucluong')!;
  }
  get trangthai() {
    return this.frmNhanvien.get('txt_trangthai')!;
  }
  resetBoloc() {
    this.phongban = '';
    localStorage.setItem('phongban', this.phongban);
    this.LoadData(this.pageSize);

    this.trinhdo = '';
    localStorage.setItem('trinhdo', this.trinhdo);
    this.LoadData(this.pageSize);

    this.bophan = '';
    localStorage.setItem('bophan', this.bophan);
    this.LoadData(this.pageSize);

    this.chucvu = '';
    localStorage.setItem('chucvu', this.chucvu);
    this.LoadData(this.pageSize);

    this.loaitrangthai = '';
    localStorage.setItem('loaitrangthai', this.loaitrangthai);
    this.LoadData(this.pageSize);
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmNhanvien = new FormGroup({
        txt_hoten: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),

        txt_gioitinh: new FormControl('', [Validators.required]),
        txt_ngaysinh: new FormControl('', [Validators.required]),
        txt_cccd: new FormControl('', [Validators.required]),
        txt_diachi: new FormControl('', [Validators.required]),
        txt_hinhanh: new FormControl('', []),
        txt_dienthoai: new FormControl('', [
          Validators.required,
          Validators.pattern('^((\\+84-?)|0)?[0-9]{10}$'),
        ]),
        txt_email: new FormControl('', [Validators.required, Validators.email]),
        txt_password: new FormControl('', [
          Validators.required,
          this.pwdCheckValidator,
        ]),
        txt_mabophan: new FormControl('', []),
        txt_maphongban: new FormControl('', []),
        txt_machucvu: new FormControl('', []),
        txt_matrinhdo: new FormControl('', []),
        txt_mabaohiem: new FormControl('', []),
        txt_maphucap: new FormControl('', []),
        txt_machucnang: new FormControl('', []),
        txt_mucluong: new FormControl('', [Validators.required]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maNhanVien: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api
        .get('/api/nhanvien/get-by-id/' + maNhanVien)
        .subscribe((res) => {
          this.nhanvien = res.nhanvien;
          console.log(res);
          this.frmNhanvien = new FormGroup({
            txt_hoten: new FormControl(this.nhanvien.hoTen, [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(250),
            ]),
            txt_gioitinh: new FormControl(this.nhanvien.gioiTinh, [
              Validators.required,
            ]),
            txt_ngaysinh: new FormControl(this.nhanvien.ngaySinh, [
              Validators.required,
            ]),
            txt_cccd: new FormControl(this.nhanvien.cccd, [
              Validators.required,
            ]),
            txt_diachi: new FormControl(this.nhanvien.diaChi, [
              Validators.required,
            ]),
            txt_hinhanh: new FormControl(this.nhanvien.hinhAnh, []),
            txt_dienthoai: new FormControl(this.nhanvien.dienThoai, [
              Validators.required,
              Validators.pattern('^((\\+91-?)|0)?[0-9]{9}$'),
            ]),
            txt_email: new FormControl(this.nhanvien.email, [
              Validators.required,
              Validators.email,
            ]),
            txt_password: new FormControl(this.nhanvien.password, [
              Validators.required,
              this.pwdCheckValidator,
            ]),
            txt_mabophan: new FormControl(this.nhanvien.maBoPhan, []),
            txt_maphongban: new FormControl(this.nhanvien.maPhongBan, []),
            txt_machucvu: new FormControl(this.nhanvien.maChucVu, []),
            txt_matrinhdo: new FormControl(this.nhanvien.maTrinhDo, []),
            txt_mabaohiem: new FormControl(this.selectedBaoHiem, []),
            txt_maphucap: new FormControl(this.selectedPhuCap, []),
            txt_machucnang: new FormControl(this.selectedChucNang, []),
            txt_mucluong: new FormControl(this.nhanvien.mucLuong, []),
            txt_trangthai: new FormControl(this.nhanvien.trangThai, []),
          });
          this.doneSetupForm = true;
          this.maPhongBan = this.nhanvien.maPhongBan;
          this.maChucVu = this.nhanvien.maChucVu;
          this.maBoPhan = this.nhanvien.maBoPhan;
          this.maTrinhDo = this.nhanvien.maTrinhDo;
          this.trangThai = this.nhanvien.trangThai;
          this.frmNhanvien
            .get('txt_ngaysinh')
            ?.patchValue(this.formatDate(new Date(this.nhanvien.ngaySinh)));
        });
    });
  }

  public onRemove(MaNhanVien: any) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
    }).then((result) => {
      if (result.isConfirmed) {
        // Người dùng xác nhận xóa
        this._api
          .delete('/api/nhanvien/delete-nhanvien', MaNhanVien)
          .subscribe((res) => {
            // Xử lý kết quả xóa thành công
            this.LoadData(this.pageSize);
          });
      }
    });
  }
  public closeModal() {
    $('#modelId').closest('.modal').modal('hide');
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

  ngAfterViewInit() {
    this.loadScripts('/assets/ckeditor/ckeditor.js');
  }

  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmNhanvien.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmNhanvien.invalid) {
      return;
    }
    let obj: any = {};
    obj.nhanvien = {
      HoTen: vl.txt_hoten,
      GioiTinh: vl.txt_gioitinh,
      NgaySinh: vl.txt_ngaysinh,
      Cccd: vl.txt_cccd,
      DiaChi: vl.txt_diachi,
      HinhAnh: vl.txt_hinhanh,
      DienThoai: vl.txt_dienthoai,
      MaTrinhDo: vl.txt_matrinhdo,
      TrangThai: vl.txt_trangthai,
    };
    obj.taikhoan = {
      Email: vl.txt_email,
      Password: vl.txt_password,
    };
    obj.nhanvienPhongban = {
      MaPhongBan: vl.txt_maphongban,
    };
    obj.nhanvienBophan = {
      MaBoPhan: vl.txt_mabophan,
    };
    obj.nhanvienChucvu = {
      MaChucVu: vl.txt_machucvu,
    };
    obj.nhanvienLuong = {
      MucLuong: vl.txt_mucluong,
    };
    obj.nhanvienBaohiem = [];
    this.selectedBaoHiem.forEach((x: any) => {
      obj.nhanvienBaohiem.push({
        MaBaoHiem: x.maBaoHiem,
      });
    });
    obj.nhanvienPhucap = [];
    this.selectedPhuCap.forEach((x: any) => {
      obj.nhanvienPhucap.push({
        MaPhuCap: x.maPhuCap,
      });
    });
    obj.nhanvienChucnang = [];
    this.selectedChucNang.forEach((x: any) => {
      obj.nhanvienChucnang.push({
        MaChucNang: x.maChucNang,
      });
    });
    console.log(obj);
    if (this.isCreate) {
      if (this.file) {
        this._api
          .uploadFileSingle('/api/upload/upload-single', 'nhanvien', this.file)
          .subscribe((res: any) => {
            if (res && res.body && res.body.filePath) {
              obj.nhanvien.HinhAnh = res.body.filePath;
              this._api
                .post('/api/nhanvien/create-nhanvien', obj)
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
                .subscribe((res) => {
                  if (res && res.data) {
                    this.sweetAlertService.showSuccessAlert(
                      'Thành công',
                      'Thêm dữ liệu thành công!'
                    );
                    this.LoadData(this.pageSize);
                    this.closeModal();
                  }
                });
            }
          });
      } else {
        this._api
          .post('/api/nhanvien/create-nhanvien', obj)
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
          .subscribe((res) => {
            if (res && res.data) {
              this.sweetAlertService.showSuccessAlert(
                'Thành công',
                'Thêm dữ liệu thành công!'
              );
              this.LoadData(this.pageSize);
              this.closeModal();
              window.location.reload();
            } 
          });
      }
    } else {
      obj.nhanvien.MaNhanVien = this.nhanvien.maNhanVien;
      if (this.file) {
        this._api
          .uploadFileSingle('/api/upload/upload-single', 'nhanvien', this.file)
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
          .subscribe((res: any) => {
            if (res && res.body && res.body.filePath) {
              obj.nhanvien.HinhAnh = res.body.filePath;
              this._api
                .post('/api/Nhanvien/update-nhanvien', obj)
                .subscribe((res) => {
                  if (res && res.data) {
                    this.sweetAlertService.showSuccessAlert(
                      'Thành công',
                      'Cập nhật dữ liệu thành công!'
                    );
                    this.LoadData(this.pageSize);
                    this.closeModal();
                    window.location.reload();
                  }
                });
            }
          });
      } else {
        this._api
          .post('/api/Nhanvien/update-nhanvien', obj)
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
          .subscribe((res) => {
            if (res && res.data) {
              this.sweetAlertService.showSuccessAlert(
                'Thành công',
                'Cập nhật dữ liệu thành công!'
              );
              this.LoadData(this.pageSize);
              this.closeModal();
            }
          });
      }
    }
  }
}
