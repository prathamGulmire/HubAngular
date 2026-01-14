import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../shared/services/course.service';
import Swal from 'sweetalert2';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxFormModule, DxButtonModule, DxPopupModule],
  providers: [CourseService]
})
export class CourseListComponent implements OnInit {

  dataSource: any;
  isPopupVisible = false;
  formData: any = {};

  constructor(private router: Router, private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCourses(0).subscribe((res) => {
      this.dataSource = res;
      // console.log(res);
    });
  }

  openEditPopup(e: any) {
    this.formData = { ...e.data }; // clone row data
    this.isPopupVisible = true;
  }

  updateCourse() {
    this.courseService.updateCourse(this.formData).subscribe((res) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.message || 'Course details updated successfully!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        // background: '#000000',
      });

      this.isPopupVisible = false;
      this.getCourses();
      this.router.navigate(["/courses"]);
    });
  }

  deleteCourse() {
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

        this.courseService.deleteCourse(this.formData.courseId).subscribe((res: any) => {
          console.log(res);
          if (!res.success) {
            Swal.fire({
              icon: 'info',
              title: "Can't delete.",
              text: 'Course is assigned to students!',
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Course record deleted successfully!',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'swal-high-zindex'
            }
          });

          this.getCourses();
        });
      }
    });
  }

  onCancel() {
    this.isPopupVisible = false;
  }
}