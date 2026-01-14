import { Component, OnInit } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { StudentService } from '../../../shared/services/student.service';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import { CourseService } from '../../../shared/services/course.service';

@Component({
  selector: 'app-unassign-course',
  templateUrl: './unassign-course.component.html',
  styleUrl: './unassign-course.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxButtonModule, DxSelectBoxModule],
  providers: [StudentService, ManageStudentCourse]
})
export class UnassignCourseComponent implements OnInit {

  selectedStudentId!: number;

  assignedCourseIds: any[] = [];
  assignedCourses: any[] = [];

  selectedCourseIds: number[] = [];

  studentList: any;

  courseList: any[] = [];

  constructor(private stud: StudentService, private studCourse: ManageStudentCourse, private course: CourseService) {

  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.studentList = res;
    });
  }

  loadCourses() {
    this.course.getCourses(0).subscribe((res) => {
      this.courseList = res;
    });
  }

  filterAssignedCourses() {
    this.assignedCourses = this.courseList.filter(c =>
      this.assignedCourseIds.includes(c.courseId)
    );
  }


  onStudentChanged(e: any) {

    this.selectedStudentId = e.value;
    this.selectedCourseIds = [];

    if (this.selectedStudentId) {
      this.loadAssignedCourses(this.selectedStudentId);
    }
  }

  loadAssignedCourses(studentId: number) {
    this.studCourse.getCourseIdsByStudentId(studentId).subscribe((res: any) => {
      this.assignedCourseIds = res;
      this.filterAssignedCourses();
    });
  }

  unassignCourses() {
    const payload = {
      studentId: this.selectedStudentId,
      courseIds: this.selectedCourseIds
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Selected course will be permanently unassigned!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unassign it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      backdrop: true,
      customClass: {
        popup: 'swal-high-zindex'
      }
    }).then((res) => {
      if (res.isConfirmed) {
        this.studCourse.unassignCourses(payload).subscribe((res: any) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 2000
          });

          // Refresh grid
          this.loadAssignedCourses(this.selectedStudentId);
          this.selectedCourseIds = [];
        });
      }
    });
  }
}