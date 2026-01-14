import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TestComponent } from './pages/test/test.component';
import { AddCourseComponent } from './pages/course-pages/add-course/add-course.component';
import { CourseListComponent } from './pages/course-pages/course-list/course-list.component';
import { AssignCourseComponent } from './pages/student-course/assign-course/assign-course.component';
import { UnassignCourseComponent } from './pages/student-course/unassign-course/unassign-course.component';

@NgModule({
  declarations: [
    TestComponent,
    AddCourseComponent,
    CourseListComponent,
    AssignCourseComponent,
    UnassignCourseComponent
  ],
  imports: [
    BrowserModule,
    // AppComponent
  ],
  providers: [],
  // bootstrap: [AppComponent]  
})
export class AppModule { }
