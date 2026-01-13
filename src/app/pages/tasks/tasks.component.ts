import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { StudentService } from '../../shared/services/student.service';
import { Router } from '@angular/router';
import { DxButtonModule, DxFileUploaderModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
// import AspNetData from 'devextreme-aspnet-data';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxFileUploaderModule, DxButtonModule,],
  providers: [
    StudentService
  ]
})

export class TasksComponent implements OnInit {
  dataSource: any;
  isPopupVisible = false;
  formData: any = {};
  genders = ['Male', 'Female', 'Other'];
  selectedImage: File | null = null;

  constructor(private stud: StudentService, private router: Router) {

  }

  ngOnInit(): void {

    this.getStudents();
  }

  openEditPopup(e: any) {
    this.formData = { ...e.data }; // clone row data
    this.isPopupVisible = true;
  }

  onImageSelected(e: any) {
    this.selectedImage = e.value?.[0] || null;
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
    });
  }

  updateUser() {

    const fd = new FormData();

    Object.keys(this.formData).forEach(key => {
      if (this.formData[key] !== null && this.formData[key] !== undefined) {
        fd.append(key, this.formData[key]);
      }
    });

    if (this.selectedImage) {
      fd.append('imageFile', this.selectedImage);
    }

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
