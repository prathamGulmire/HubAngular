import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../shared/services/student.service';
import { DxButtonModule, DxDataGridModule, DxFileUploaderModule, DxFormComponent, DxFormModule, DxPopupModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { EnvironmentCls } from '../../../environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxFormModule, DxPopupModule, DxFileUploaderModule, DxButtonModule, CommonModule]
})
export class TestComponent {

  dataSource: any;
  genders = ['Male', 'Female', 'Other'];

  profileImageFile: File | null = null;
  profileImageError = false;
  profileImageErrorMessage = '';

  imagePreviewUrl: string | null = null;

  showUploader = true;

  readonly IMAGE_BASE_URL = `${EnvironmentCls.photoUrl}/uploads/`;

  constructor(private stud: StudentService, private router: Router) {

  }

  ngOnInit(): void {
    this.getStudents();
  }

  onEdit(e: any) {
    console.log('onEdit executed!', e.data);
    this.resetUploader();

    if (e.data?.imageUrl) {
      this.imagePreviewUrl =
        this.IMAGE_BASE_URL + e.data.imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }

    this.profileImageFile = null; // reset file input
  }

  resetUploader() {
    this.showUploader = false;
    this.profileImageFile = null;
    this.imagePreviewUrl = null;

    // let Angular destroy component
    setTimeout(() => {
      this.showUploader = true;
    });
  }

  initNewRow(e: any) {
    console.log("initNewRow executed!");
    this.resetUploader();

    e.data = {
      id: 0,
      firstName: 'shambhu',
      middleName: 'dfdd',
      lastName: 'gulmire',
      email: 'djdj@gmail.com',
      gender: 'Male',
      dateOfBirth: null,
      address: 'dmdvdkfj',
      country: 'india',
      state: 'maharashtra',
      pincode: '413307',
      password: 'kdjvdvd',
      imageUrl: ''
    };
  }

  onRowValidating(e: any) {
    console.log("onRowValidating executed!");
    // Only validate image on INSERT

    if (!this.profileImageFile) {
      e.isValid = false;

      // e.errorText = 'Profile image is required';

      this.profileImageError = true;
      this.profileImageErrorMessage = 'Profile image is required';
    }
  }


  insertRow(e: any) {
    const fd = new FormData();

    // if (!this.profileImageFile) {
    //   this.profileImageError = true;
    //   this.profileImageErrorMessage = 'Profile image is required';

    //   e.cancel = true;
    //   return;
    // }

    Object.keys(e.data).forEach(key => {
      if (e.data[key] !== null && e.data[key] !== undefined) {
        fd.append(key, e.data[key]);
      }
    });

    if (this.profileImageFile) {
      fd.append('imageFile', this.profileImageFile);
    }

    console.log('INSERT payload ready', e.data);
    console.log('With image file:', this.profileImageFile);
    // call API here

    this.addUser(fd);
  }

  addUser(data: any) {
    this.stud.addStudent(data).subscribe((res) => {
      console.log("Student added successfully!", res);
      this.getStudents();
    });
  }

  updateRow(e: any) {
    const updatedData = {
      ...e.oldData,
      ...e.newData
    };

    const fd = new FormData();
    Object.keys(updatedData).forEach(key => {
      fd.append(key, updatedData[key]);
    });

    if (this.profileImageFile) {
      fd.append('imageFile', this.profileImageFile);
    }

    this.profileImageFile = null;
    console.log('UPDATE payload ready', updatedData);

    this.updateUser(fd);
    // call API here
  }

  removeRow(e: any) {
    console.log("removeRow executed!");
    console.log("Deleted data: ", e.data);
  }

  onImageSelected(e: any) {
    const file = e.value?.[0];

    if (!file) {
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Profile image is required';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Only image files are allowed';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.profileImageError = true;
      this.profileImageErrorMessage = 'Image size must be less than 2MB';
      return;
    }

    this.profileImageFile = file;
    this.profileImageError = false;
    this.profileImageErrorMessage = '';

    // 🔥 Image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
    });
  }

  updateUser(data: any) {

    // const fd = new FormData();

    // Object.keys(this.formData).forEach(key => {
    //   if (this.formData[key] !== null && this.formData[key] !== undefined) {

    //     if (key !== 'imageFile') {
    //       fd.append(key, this.formData[key]);
    //     }
    //   }
    // });

    // if (this.selectedImage) {
    //   fd.append('imageFile', this.selectedImage);
    // }

    // fd.append('imageFile', this.formData.imageFile);

    this.stud.updateStudent(data).subscribe((res) => {
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
      this.getStudents();
      this.router.navigate(["/students"]);
    });
  }

  deleteUser() {
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
        this.stud.deleteStudent(0).subscribe({
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
    // this.isPopupVisible = false;
  }
}
