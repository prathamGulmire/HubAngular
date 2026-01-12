import { Component, OnInit } from '@angular/core';
import { DxButtonModule, DxFormModule } from 'devextreme-angular';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
  standalone: true,
  imports: [DxFormModule, DxButtonModule]
})
export class AddCourseComponent implements OnInit {

  formData = {
    CourseCode: "",
    CourseName: "",
    Description: "",
    DurationInMonths: 0
  };

  constructor() { }

  ngOnInit(): void {

  }

  onSubmit() {
    console.log("Course data: ", this.formData);
  }
}
