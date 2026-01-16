import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxButtonModule, DxFormComponent, DxFormModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { CourseService } from '../../../shared/services/course.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
  standalone: true,
  imports: [DxFormModule, DxButtonModule]
})
export class AddCourseComponent implements OnInit {

  @ViewChild('myForm', { static: false }) userForm!: DxFormComponent;

  formData = {
    CourseCode: "",
    CourseName: "",
    Description: "",
    DurationMonths: 1
  };

  constructor(private router: Router, private courseService: CourseService) { }

  ngOnInit(): void {

  }

  onSubmit() {

    const res = this.userForm.instance.validate();

    if(!res.isValid) {
      return;
    }

    this.courseService.addCourse(this.formData).subscribe((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Course Added!',
        text: 'Course record added successfully!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/courses']);
      });
    });
  }
}
