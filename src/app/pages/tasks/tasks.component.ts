import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { StudentService } from '../../shared/services/student.service';
import { Router } from '@angular/router';
import { DxButtonModule, DxFileUploaderModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
// import AspNetData from 'devextreme-aspnet-data';

@Component({
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxFileUploaderModule, DxButtonModule,],
  providers: [
    StudentService
  ]
})

export class TasksComponent implements OnInit {
  dataSource: any;
  isPopupVisible = false;
  formData: any = {};
  genders = ['Male', 'Female', 'Other'];
  selectedImage: File | null = null;

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

  onImageSelected(e: any) {
    this.selectedImage = e.value?.[0] || null;
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
    })
  }

  updateUser() {

    const fd = new FormData();

    Object.keys(this.formData).forEach(key => {
      if (this.formData[key] !== null && this.formData[key] !== undefined) {
        fd.append(key, this.formData[key]);
      }
    });

    if (this.selectedImage) {
      fd.append('imageFile', this.selectedImage);
    }

    this.stud.updateStudent(fd).subscribe((res) => {
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
