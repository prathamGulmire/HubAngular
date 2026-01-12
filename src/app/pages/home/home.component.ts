import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DxFileUploaderModule, DxFormModule } from 'devextreme-angular';
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
import { __values } from 'tslib';
import { AuthService } from '../../shared/services';
import Swal from 'sweetalert2';

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
    DxButtonModule,
    DxFileUploaderModule
  ],
  providers: [
    StudentService,
    AuthService
  ]
})

export class HomeComponent implements OnInit {

  colCountByScreen: object;
  isEditMode = false;
  sid!: any;
  genders = ['Male', 'Female', 'Other'];
  selectedImage: File | null = null;

  constructor(private studentService: StudentService, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3
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
    password: 'Sham@123',
    imageUrl: ""
  };

  onImageSelected(e: any) {
    this.selectedImage = e.value?.[0] || null;
  }

  loadUser(id: string) {
    this.studentService.getStudent(id).subscribe((res) => {
      if (res[0] == null || res.length == 0) {
        alert("Data with specified id not found!");
        this.router.navigate(["/home"]);
        return;
      }
      this.formData = res[0];
    });
  }

  private buildFormData(): FormData {
    const fd = new FormData();

    Object.keys(this.formData).forEach(key => {
      let value = (this.formData as any)[key];

      if (value !== null && value !== undefined) {

        if (key === 'dateOfBirth') {
          const dob = new Date(value);
          value = dob.toISOString().substring(0, 10);
        }

        fd.append(key, value);
      }
    });

    if (this.selectedImage) {
      fd.append('imageFile', this.selectedImage);
    }

    console.log(fd);

    return fd;
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  addUser() {

    const fd = this.buildFormData();

    this.studentService.addStudent(fd).subscribe((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Student Added!',
        text: 'Student record added successfully!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/students']);
      });
    });
  }

  updateUser() {

    const fd = this.buildFormData();

    this.studentService.updateStudent(fd).subscribe((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Student Updated!',
        text: 'Student record updated successfully!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/students']);
      });
    });
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
