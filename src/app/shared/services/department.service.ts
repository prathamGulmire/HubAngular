import { Injectable } from '@angular/core';
import { EnvironmentCls } from '../../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl: string = `${EnvironmentCls.apiUrl}/Department`;

  constructor(private http: HttpClient) { }

  getDepartment(id: any) {
    return this.http.get(this.baseUrl + '/GetDepartment/' + id);
  }

  addDepartment(payload: any) {
    return this.http.post(this.baseUrl + '/AddDepartment', payload);
  }

  updateDepartment(payload: any) {
    return this.http.put(this.baseUrl + '/UpdateDepartment', payload);
  }

  deleteDepartment(id: any) {
    // this.http.delete(this.baseUrl + '/DeleteDepartment/' + id);
    return this.http.delete(`${this.baseUrl}/DeleteDepartment/${id}`);
  }

  getDepartmentNameByStudentId(studentId: any) {
    return this.http.get(this.baseUrl + '/GetDepartmentName?studentId=' + studentId);
  }
}