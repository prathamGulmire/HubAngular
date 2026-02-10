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
    return this.http.get<IDepartment>(this.baseUrl + '/GetDepartment/' + id);
  }

  addDepartment(payload: any) {
    return this.http.post<IDepartment>(this.baseUrl + '/AddDepartment', payload);
  }

  updateDepartment(payload: any) {
    return this.http.put<IDepartment>(this.baseUrl + '/UpdateDepartment', payload);
  }

  deleteDepartment(id: any) {
    // this.http.delete(this.baseUrl + '/DeleteDepartment/' + id);
    return this.http.delete<IDepartment>(`${this.baseUrl}/DeleteDepartment/${id}`);
  }

  getDepartmentNameByStudentId(studentId: any) {
    return this.http.get<IDepartment>(this.baseUrl + '/GetDepartmentName?studentId=' + studentId);
  }
}

export interface IDepartment {
  data: any,
  isSuccess: boolean,
  message: string
}