import { Component, OnInit } from '@angular/core';
import { ManageStudentCourse } from '../../../shared/services/manageStudentCourse';
import { AuthService } from '../../../shared/services';
import { CourseService } from '../../../shared/services/course.service';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss',
  standalone: true,
  imports: [DxDataGridModule],
  providers: [AuthService, ManageStudentCourse, CourseService]
})
export class MyCoursesComponent implements OnInit {

  courseIds: any[] = [];

  courses: any[] = [];

  studentId: any;

  allCourses: any[] = [];

  constructor(private api: ManageStudentCourse, private auth: AuthService, private course: CourseService) { }

  ngOnInit(): void {
    const user = this.auth.getUser();
    this.studentId = user?.studentId;

    this.loadAllCourses();
    this.loadCourses();
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
}
