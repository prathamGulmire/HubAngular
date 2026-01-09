import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { StudentService } from '../../shared/services/student.service';
import { Router } from '@angular/router';
import { DxFormModule, DxPopupModule } from 'devextreme-angular';
// import AspNetData from 'devextreme-aspnet-data';

@Component({
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule],
  providers: [
    StudentService
  ]
})

export class TasksComponent implements OnInit {
  dataSource: any;
  isPopupVisible = false;
  formData: any = {};
  genders = ['Male', 'Female', 'Other'];

  constructor(private stud: StudentService, private router: Router) {

  }

  ngOnInit(): void {

    this.getStudents();
  }

  onRowDblClick(e: any) {
    this.router.navigate(['/home', e.data.id]);
  }

  openEditPopup(e: any) {
    this.formData = { ...e.data }; // clone row data
    this.isPopupVisible = true;
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
    })
  }

  updateUser() {
    this.stud.updateStudent(this.formData).subscribe((res) => {
      console.log(res);
      alert(res.message);
      this.isPopupVisible = false;
      this.getStudents();
      this.router.navigate(["/students"]);
    })
  }

  deleteUser() {
    if (!confirm('Are you sure you want to delete?')) return;

    this.stud.deleteStudent(this.formData.id).subscribe((res) => {
      console.log(res);
      alert(res.message);
      this.router.navigate(["/students"]);
    });
  }
}
