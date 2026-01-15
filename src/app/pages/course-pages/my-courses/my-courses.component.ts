import { Component, OnInit } from '@angular/core';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import { AuthService } from '../../../shared/services';
import { CourseService } from '../../../shared/services/course.service';
import { DxButtonModule, DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, CommonModule, DxButtonModule],
  providers: [AuthService, ManageStudentCourse, CourseService]
})
export class MyCoursesComponent implements OnInit {

  courseIds: any[] = [];

  courses: any[] = [];

  studentId: any;

  allCourses: any[] = [];

  isPopupVisible: boolean = false;
  selectedCourse: any = null;

  constructor(private api: ManageStudentCourse, private auth: AuthService, private course: CourseService) { }

  ngOnInit(): void {
    const user = this.auth.getUser();
    this.studentId = user?.studentId;

    // this.loadAllCourses();
    // this.loadCourses();

    forkJoin({
      allCourses: this.course.getCourses(0),
      courseIds: this.api.getCourseIdsByStudentId(this.studentId)
    }).subscribe(({ allCourses, courseIds }) => {
      this.allCourses = allCourses;
      this.courseIds = courseIds;

      this.filterCourses();
    });
  }

  openEditPopup(e: any) {
    this.isPopupVisible = true;
    this.selectedCourse = { ...e.data };
    console.log("selectedCourse ", this.selectedCourse);
  }

  loadAllCourses() {
    this.course.getCourses(0).subscribe((res) => {
      this.allCourses = res;
      console.log(this.allCourses);
    });
  }

  loadCourses() {
    this.api.getCourseIdsByStudentId(this.studentId).subscribe((res: any) => {
      this.courseIds = res;
      console.log(this.courseIds);
      this.filterCourses();
    });
  }

  filterCourses() {
    this.courses = this.allCourses.filter(c =>
      this.courseIds.includes(c.courseId)
    );
    console.log(this.courses);
  }

  onCancel() {
    this.isPopupVisible = false;
    this.selectedCourse = null;
  }
}
