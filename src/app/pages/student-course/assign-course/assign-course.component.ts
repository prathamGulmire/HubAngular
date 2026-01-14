import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../shared/services/student.service';
import { CourseService } from '../../../shared/services/course.service';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-course',
  templateUrl: './assign-course.component.html',
  styleUrl: './assign-course.component.scss',
  standalone: true,
  imports: [DxSelectBoxModule, DxDataGridModule, DxButtonModule],
  providers: [StudentService, CourseService, ManageStudentCourse]
})
export class AssignCourseComponent implements OnInit {

  studentList: any[] = [];
  courseList: any[] = [];

  selectedStudentId: number | null = null;
  selectedCourseIds: number[] = [];

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private manageStudentCourseService: ManageStudentCourse
  ) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents() {
    this.studentService.getStudent(0).subscribe((res) => {
      this.studentList = res;
    });
  }

  loadCourses() {
    this.courseService.getCourses(0).subscribe((res) => {
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

  loadAssignedCourses(id: any) {
    this.manageStudentCourseService.getCourseIdsByStudentId(id).subscribe((res: any) => {
      this.selectedCourseIds = res;
    });
  }

  onCourseSelectionChanged(e: any) {
    this.selectedCourseIds = e.selectedRowKeys;
  }

  displayStudent = (item: any) => {
    if (!item) return '';
    return `${item.id} ${item.firstName} ${item.lastName}`;
  };

  assignCourses() {

    const payload = {
      Sid: this.selectedStudentId,
      CourseIds: this.selectedCourseIds
    };

    this.manageStudentCourseService.assignCourse(payload).subscribe((res: any) => {
      // alert(res.message);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      this.selectedStudentId = null;
      this.selectedCourseIds = [];
    });
  }
}
