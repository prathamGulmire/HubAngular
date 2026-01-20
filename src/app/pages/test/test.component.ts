import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../shared/services/student.service';
import { DxButtonModule, DxDataGridModule, DxFileUploaderModule, DxFormComponent, DxFormModule, DxPopupModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxFormModule, DxPopupModule, DxFileUploaderModule, DxButtonModule, CommonModule]
})
export class TestComponent {

  dataSource: any;
  isPopupVisible = false;
  formData: any = null;
  genders = ['Male', 'Female', 'Other'];
  selectedImage: File | null = null;

  profileImageFile: File | null = null;
  profileImageError = false;
  profileImageErrorMessage = '';

  constructor(private stud: StudentService, private router: Router) {

  }

  ngOnInit(): void {
    this.getStudents();
  }

  openEditPopup(e: any) {
    this.formData = { ...e.data };
    this.isPopupVisible = true;
  }

  onEdit(e: any) {
    console.log("onEdit executed!", e.data);
  }

  initNewRow(e: any) {
    console.log("initNewRow executed!");

    e.data = {
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      gender: null,
      dateOfBirth: null,
      address: '',
      country: '',
      state: '',
      pincode: '',
      password: '',
      imageFile: ''
    };
  }

  insertRow(e: any) {
    console.log("insertRow executed!", e.data);
  }

  updateRow(e: any) {
    console.log('newData:', e.newData);
    console.log('oldData:', e.oldData);
  }

  removeRow(e: any) {
    console.log("removeRow executed!");
    console.log("Deleted data: ", e.data);
  }

  onImageSelected(e: any) {

    this.selectedImage = e.value?.[0] || null;

    if (!this.selectedImage) {
      this.profileImageFile = null;
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Profile image is required';
      return;
    }

    if (!this.selectedImage.type.startsWith('image/')) {
      this.profileImageFile = null;
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Only image files are allowed';
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (this.selectedImage.size > maxSize) {
      this.profileImageFile = null;
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Image size must be less than 2MB';
      return;
    }

    this.profileImageFile = this.selectedImage;
    this.profileImageError = false;
    this.profileImageErrorMessage = '';
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
      console.log(res);
    });
  }

  updateUser() {

    if (!this.profileImageFile) {
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Profile image is required';
    }

    const fd = new FormData();

    Object.keys(this.formData).forEach(key => {
      if (this.formData[key] !== null && this.formData[key] !== undefined) {

        if (key !== 'imageFile') {
          fd.append(key, this.formData[key]);
        }
      }
    });

    // if (this.selectedImage) {
    //   fd.append('imageFile', this.selectedImage);
    // }

    fd.append('imageFile', this.formData.imageFile);

    this.stud.updateStudent(fd).subscribe((res) => {
      console.log(res);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.message || 'Student updated successfully!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.isPopupVisible = false;
      this.getStudents();
      this.router.navigate(["/students"]);
    });
  }

  deleteUser() {
    this.isPopupVisible = false;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      backdrop: true,
      customClass: {
        popup: 'swal-high-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.stud.deleteStudent(this.formData.id).subscribe({
          next: (res) => {
            // console.log(res);
            if (!res.success) {
              Swal.fire({
                icon: 'info',
                title: "Can't delete.",
                text: 'Courses are assigned to students!',
                showConfirmButton: false,
                timer: 2000,
              });
              return;
            }

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Student record deleted successfully!',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              customClass: {
                popup: 'swal-high-zindex'
              }
            });

            this.getStudents();
            this.router.navigate(['/students']);
          }
        });
      }
    });
  }

  onCancel() {
    this.isPopupVisible = false;
  }
}
