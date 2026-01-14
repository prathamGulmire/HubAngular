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
  assignedCourses: any[] = [];
  selectedCourseIds: number[] = [];
  studentList: any;

  courseList: any[] = [];

  constructor(private stud: StudentService, private studCourse: ManageStudentCourse, private course: CourseService) {

  }

  ngOnInit(): void {
    this.loadStudents();
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

  onStudentChanged(e: any) {

    this.selectedStudentId = e.value;
    this.selectedCourseIds = [];

    if (this.selectedStudentId) {
      this.loadAssignedCourses(this.selectedStudentId);
    }
  }

  loadAssignedCourses(studentId: number) {
    this.studCourse.getCourseIdsByStudentId(studentId).subscribe((res: any) => {
      this.assignedCourses = res;
      console.log("StudenId: ", studentId);
      console.log("Assigned course ids: ", res);
    });
  }

  unassignCourses() {
    const payload = {
      studentId: this.selectedStudentId,
      courseIds: this.selectedCourseIds
    };

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

} 
