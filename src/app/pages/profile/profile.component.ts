import { Component, OnInit } from '@angular/core';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { AuthService } from '../../shared/services';
import { StudentService } from '../../shared/services/student.service';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [DxFormModule, CommonModule],
})

export class ProfileComponent implements OnInit {

  student: any;
  colCountByScreen: object;
  imageBaseUrl = 'https://localhost:7262/uploads/';

  constructor(private auth: AuthService, private studentService: StudentService) {

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

        if(this.student.isActive == true) {
          this.student.isActive = "Yes";
        } else {
          this.student.isActive = "No";
        }

        this.student.dateOfBirth = this.student.dateOfBirth.substring(0, 10);
        this.student.updatedAt =  this.student.updatedAt.substring(0, 10) + ' ' + this.student.updatedAt.substring(11, 16);
      });
    }
  }

  get imageUrl() {
    return this.student?.imageUrl
      ? this.imageBaseUrl + this.student.imageUrl
      : '';
  }
}
