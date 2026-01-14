import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../shared/services/student.service';
import { CourseService } from '../../../shared/services/course.service';
import { AuthService } from '../../../shared/services';
import { DxButtonModule, DxDataGridModule, DxTooltipModule } from 'devextreme-angular';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-enroll',
  templateUrl: './course-enroll.component.html',
  styleUrl: './course-enroll.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxButtonModule, DxTooltipModule],
  providers: []
})
export class CourseEnrollComponent implements OnInit {

  studentId: any;
  courseList: any[] = [];
  selectedCourseIds: any[] = [];

  areCoursesAlreadyEnrolled: boolean = false;

  constructor(
    private stud: StudentService,
    private course: CourseService,
    private auth: AuthService,
    private api: ManageStudentCourse
  ) { }

  ngOnInit(): void {
    const user = this.auth.user;
    this.studentId = user?.studentId;

    this.loadCourses();
  }

  loadCourses() {
    this.course.getCourses(0).subscribe((res) => {
      this.courseList = res;
    });
  }

  areCoursesEnrolled() {

  }

  onCourseSelectionChanged(e: any) {

    if (e.selectedRowKeys.length > 4) {
      e.component.deselectRows(e.currentSelectedRowKeys);
      return;
    }

    this.selectedCourseIds = e.selectedRowKeys;
  }

  enrollCourses() {
    if (this.selectedCourseIds.length !== 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Selection',
        text: 'Please select exactly 4 courses to enroll.'
      });
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Confirm Enrollment',
      text: 'Are you sure you want to enroll in the selected courses?',
      showCancelButton: true,
      confirmButtonText: 'Yes, enroll',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const enrollData = {
        Sid: this.studentId,
        CourseIds: this.selectedCourseIds
      };

      this.api.assignCourse(enrollData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Enrollment Successful',
            text: 'Courses have been enrolled successfully!'
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Enrollment Failed',
            text: err?.error?.message || 'Something went wrong. Please try again.'
          });
        }
      });
    });
  }
}