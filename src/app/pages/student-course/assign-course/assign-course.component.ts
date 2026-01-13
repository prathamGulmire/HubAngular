import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../shared/services/student.service';
import { CourseService } from '../../../shared/services/course.service';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';

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
  assignedCourseIds: number[] = [];

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
      // this.assignedCourseIds = res;
      // this.selectedCourseIds = [];
    });
  }

  onSelectionChanging(e: any) {
    if (!e.currentSelectedRowKeys) return;

    const blocked = e.currentSelectedRowKeys
      .some((id: number) => this.assignedCourseIds.includes(id));

    if (blocked) {
      e.cancel = true;
    }
  }

  onRowPrepared(e: any) {
    if (e.rowType === 'data' &&
      this.assignedCourseIds.includes(e.data.courseId)) {

      e.rowElement.classList.add('dx-row-disabled');
    }
  }

  isRowSelectable = (e: any) => {
    return !this.assignedCourseIds.includes(e.key);
  };

  onCourseSelectionChanged(e: any) {
    this.selectedCourseIds = e.selectedRowKeys;
  }

  assignCourses() {

    const payload = {
      Sid: this.selectedStudentId,
      CourseIds: this.selectedCourseIds
    };

    this.manageStudentCourseService.assignCourse(payload).subscribe((res: any) => {
      alert(res.message);
      this.selectedStudentId = null;
      this.selectedCourseIds = [];
    });
  }
}
