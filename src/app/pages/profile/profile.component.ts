import { Component, OnInit } from '@angular/core';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { AuthService } from '../../shared/services';
import { StudentService } from '../../shared/services/student.service';
import { CommonModule } from '@angular/common';
import { EnvironmentCls } from '../../../environment';
import { DepartmentService } from '../../shared/services/department.service';
import { DxTextBoxModule } from 'devextreme-angular';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [DxFormModule, CommonModule, DxTextBoxModule],
})

export class ProfileComponent implements OnInit {

  student: any;
  colCountByScreen: object;
  imageBaseUrl = EnvironmentCls.photoUrl + '/uploads/';
  // imageBaseUrl = 'https://localhost:7262/uploads/';
  // imageBaseUrl = 'http://172.20.10.3:5000/uploads/';    // mobile hotspot
  // imageBaseUrl = 'http://192.168.31.9:5000/uploads/';

  departmentName: string = "";

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private depart: DepartmentService
  ) {
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3
    };
  }

  ngOnInit(): void {
    const res = this.auth.getUser();

    if (res?.studentId && res.studentId > 0) {
      this.studentService.getStudent(res?.studentId).subscribe((response) => {
        this.student = response[0];
        console.log(this.student);

        if (this.student.isActive == true) {
          this.student.isActive = "Yes";
        } else {
          this.student.isActive = "No";
        }

        this.student.dateOfBirth = this.student.dateOfBirth.substring(0, 10);
        this.student.updatedAt = this.student.updatedAt.substring(0, 10) + ' ' + this.student.updatedAt.substring(11, 16);

        if (this.student.role == 'user') {
          this.student.role = 'student';
        }

        // const payload = {
        //   id: this.student.departmentId
        // };

        this.depart.getDepartmentNameByStudentId(this.student.id).subscribe((res: any) => {
          
          if(res.isSuccess) {
            const data = res.data;
            this.departmentName = data[0].departmentName;
          }
        });
      });
    }
  }

  get imageUrl() {
    return this.student?.imageUrl
      ? this.imageBaseUrl + this.student.imageUrl
      : '';
  }

  // get departName() {
  //   return "";
  // }
}