import { RoleBP, RoleCV, RolePB } from './role';

export class User {
  maNhanVien: number;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  cccd: string;
  diaChi: string;
  hinhAnh: string;
  dienThoai: string;
  email: string;
  tenPhongBan: string;
  tenBoPhan: string;
  tenChucVu: string;
  rolePB: RolePB;
  roleBP: RoleBP;
  roleCV: RoleCV;
  token?: string;
}
