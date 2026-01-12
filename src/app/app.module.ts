import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TestComponent } from './pages/test/test.component';
import { AddCourseComponent } from './pages/course-pages/add-course/add-course.component';
import { CourseListComponent } from './pages/course-pages/course-list/course-list.component';

@NgModule({
  declarations: [
    TestComponent,
    AddCourseComponent,
    CourseListComponent
  ],
  imports: [
    BrowserModule,
    // AppComponent
  ],
  providers: [],
  // bootstrap: [AppComponent]  
})
export class AppModule { }
