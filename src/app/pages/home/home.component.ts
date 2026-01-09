import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import {
  DxTextBoxModule,
  DxTextAreaModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxButtonModule
} from 'devextreme-angular';
import { StudentService } from '../../shared/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'rxjs';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxButtonModule
  ],
  providers: [
    StudentService
  ]
})

export class HomeComponent implements OnInit {

  colCountByScreen: object;
  isEditMode = false;
  sid!: any;
  genders = ['Male', 'Female', 'Other'];

  constructor(private studentService: StudentService, private router: Router, private route: ActivatedRoute) {
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };
  }

  ngOnInit(): void {

    this.sid = this.route.snapshot.paramMap.get("id");

    if (this.sid) {
      this.isEditMode = true;
      this.loadUser(this.sid);
    }
  }

  formData = {
    id: 0,
    firstName: 'shambhu',
    middleName: 'A',
    lastName: 'Gulmire',
    email: 'sham@gmail.com',
    gender: 'Male',
    dateOfBirth: null,
    address: 'Kumbhar galli, Sangola',
    country: 'India',
    state: 'Maharashtra',
    pincode: '413307',
    password: 'Sham@123'
  };

  loadUser(id: string) {
    this.studentService.getStudent(id).subscribe((res) => {
      if(res[0] == null || res.length == 0) {
        alert("Data with specified id not found!");
        this.router.navigate(["/home"]);
        return;
      }
      this.formData = res[0];
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  addUser() {
    this.studentService.addStudent(this.formData).subscribe((res) => {
      console.log(res);
      alert("Student record added successfully!");
      this.router.navigate(["/students"]);
    });
  }

  updateUser() {
    this.studentService.updateStudent(this.formData).subscribe((res) => {
      console.log(res);
      alert(res.message);
      this.router.navigate(["/students"]);
    })
  }

  deleteUser() {
    if (!confirm('Are you sure you want to delete?')) return;

    this.studentService.deleteStudent(this.formData.id).subscribe((res) => {
      console.log(res);
      alert(res.message);
      this.router.navigate(["/students"]);
    });
  }
}
