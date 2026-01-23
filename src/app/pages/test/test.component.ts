import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../shared/services/student.service';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxFileUploaderModule, DxFormComponent, DxFormModule, DxPopupModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { EnvironmentCls } from '../../../environment';
import notify from 'devextreme/ui/notify';
import DevExpress from 'devextreme';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportPdf } from 'devextreme/common/export/pdf';
import { exportDataGrid as exportExcel } from 'devextreme/common/export/excel';
import ExcelJs from 'exceljs';
import saveAs from 'file-saver';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxFormModule,
    DxPopupModule,
    DxFileUploaderModule,
    DxButtonModule,
    CommonModule,
  ]
})
export class TestComponent {

  @ViewChild('datagrid', { static: false })
  dataGrid!: DxDataGridComponent;

  currentEditKey: any = null;

  dataSource: any;
  genders = ['Male', 'Female', 'Other'];

  profileImageFile: File | null = null;
  profileImageError = false;
  profileImageErrorMessage = '';

  imagePreviewUrl: string | null = null;

  showUploader = true;

  isInsertMode: boolean = false;

  readonly IMAGE_BASE_URL = `${EnvironmentCls.photoUrl}/uploads/`;

  constructor(private stud: StudentService, private router: Router) {

  }

  ngOnInit(): void {
    this.getStudents();
  }

  onEdit(e: any) {
    console.log('onEdit executed!', e.data);

    // e.cancel = true;

    this.isInsertMode = false;
    // this.showUploader = false;
    // this.imagePreviewUrl = null;
    this.onEditCanceling(e);

    // this.resetUploader();

    this.profileImageError = false;
    this.profileImageErrorMessage = '';
    this.currentEditKey = e.key;

    // console.log("Curreneditkey: ", this.currentEditKey);

    if (e.data?.imageUrl) {
      this.imagePreviewUrl =
        this.IMAGE_BASE_URL + e.data.imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }

    this.profileImageFile = null;
    // this.showUploader = false;
  }

  onEditCanceling(e: any) {
    console.log("OnEditCanceling executed!");
    this.imagePreviewUrl = null;
    this.showUploader = false;
    this.profileImageFile = null;
  }

  resetUploader() {

    this.showUploader = false;
    this.profileImageFile = null;
    this.imagePreviewUrl = null;


    setTimeout(() => {
      this.showUploader = true;
    });
  }

  initNewRow(e: any) {
    console.log("initNewRow executed!");

    this.isInsertMode = true;

    this.resetUploader();
    // this.showUploader = true;

    e.data = {
      id: 0,
      firstName: 'shambhu',
      middleName: 'A',
      lastName: 'Gulmire',
      email: 'email@gmail.com',
      gender: 'Male',
      dateOfBirth: null,
      address: 'Somewhere in Sangola',
      country: 'India',
      state: 'Maharashtra',
      pincode: '413307',
      password: 'Sham1212',
      imageUrl: ''
    };
  }

  onSaving(e: any) {

    console.log("OnSaving clicked");

    if (e.changes?.length === 0) {

      e.cancel = true;

      notify(
        'No changes detected to save',
        'warning',
        2000
      );

    }
  }


  onRowValidating(e: any) {
    console.log("onRowValidating executed!");

    console.log("IsInsertMode: ", this.isInsertMode);

    if (this.isInsertMode && !this.profileImageFile) {

      e.isValid = false;

      console.log("ProfileImageFile: ", this.profileImageFile)

      this.profileImageError = true;
      this.profileImageErrorMessage = 'Profile image is required';
    }
  }

  insertRow(e: any) {
    const fd = new FormData();

    // if (!this.profileImageFile) {
    //   this.profileImageError = true;
    //   this.profileImageErrorMessage = 'Profile image is required';

    //   e.cancel = true;
    //   return;
    // }

    Object.keys(e.data).forEach(key => {

      if (e.data[key] !== null && e.data[key] !== undefined) {

        fd.append(key, e.data[key]);
      }
    });

    if (this.profileImageFile) {
      fd.append('imageFile', this.profileImageFile);
    }

    console.log('INSERT payload ready', e.data);
    console.log('With image file:', this.profileImageFile);


    this.addUser(fd);
  }

  addUser(data: any) {

    this.stud.addStudent(data).subscribe({

      next: (res: any) => {
        console.log('Student added successfully!', res);
        this.getStudents();
      },

      error: (err: any) => {
        console.error('Error occurred while adding student!', err);
      }
    });
  }

  updateRow(e: any) {

    // e.cancel = true;

    const updatedData = {
      ...e.oldData,
      ...e.newData
    };

    const fd = new FormData();

    Object.keys(updatedData).forEach(key => {

      fd.append(key, updatedData[key]);
    });

    if (this.profileImageFile) {
      fd.append('imageFile', this.profileImageFile);
    }

    this.profileImageFile = null;
    // console.log('UPDATE payload ready', updatedData);

    this.updateUser(fd);

    this.showUploader = false;
    this.imagePreviewUrl = null;
  }

  removeRow(e: any) {

    console.log("removeRow executed!");
    console.log("Deleted data: ", e.data);

    e.cancel = true;

    this.deleteUser(e.data.id);
  }

  onImageSelected(e: any) {

    this.showUploader = true;

    setTimeout(() => {
      this.showUploader = false;
    });

    const file = e.value?.[0];
    // this.showUploader = true;
    console.log("showUploader: ", this.showUploader);

    const rowIdx = this.dataGrid.instance.getRowIndexByKey(this.currentEditKey);
    console.log('Row index:', rowIdx);

    this.profileImageFile = file;
    console.log("image: ", this.profileImageFile);
    this.profileImageError = false;
    this.profileImageErrorMessage = '';

    console.log("CurrentImageName: ", this.dataGrid.instance.cellValue(rowIdx, 'imageUrl'));

    // this.dataGrid.instance.cellValue(
    //   this.currentEditKey,
    //   'imageUrl',
    //   `updated_${Date.now()}`
    // );
    const newImageValue = `updated_${Date.now()}`;
    this.dataGrid.instance.cellValue(
      rowIdx,
      'imageUrl',
      newImageValue
    );

    // console.log("currentEditKey: ", this.currentEditKey);
    console.log("updatedImageName: ", this.dataGrid.instance.cellValue(rowIdx, 'imageUrl'));

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
      console.log("ImagePreviewUrl: ", this.imagePreviewUrl);
    };
    reader.readAsDataURL(file);
  }

  removeImage() {

    this.profileImageFile = null;
    this.imagePreviewUrl = null;
    this.profileImageError = false;

    this.showUploader = false;
    console.log("ShowUploader: ", this.showUploader);

    setTimeout(() => {
      this.showUploader = true;
      console.log("ShowUploader: ", this.showUploader);
    });
  }

  getStudents() {
    this.stud.getStudent(0).subscribe((res) => {
      this.dataSource = res;
    });
  }

  updateUser(data: any) {

    // const fd = new FormData();

    // Object.keys(this.formData).forEach(key => {
    //   if (this.formData[key] !== null && this.formData[key] !== undefined) {

    //     if (key !== 'imageFile') {
    //       fd.append(key, this.formData[key]);
    //     }
    //   }
    // });

    // if (this.selectedImage) {
    //   fd.append('imageFile', this.selectedImage);
    // }

    // fd.append('imageFile', this.formData.imageFile);

    this.stud.updateStudent(data).subscribe((res) => {
      console.log(res);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.message || 'Student updated successfully!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.getStudents();
      // this.router.navigate(["/students"]);
    });
  }

  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      backdrop: true,
      customClass: {
        popup: 'swal-high-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.stud.deleteStudent(id).subscribe({
          next: (res) => {
            // console.log(res);
            if (!res.success) {
              Swal.fire({
                icon: 'info',
                title: "Can't delete.",
                text: 'Courses are assigned to students!',
                showConfirmButton: false,
                timer: 2000,
              });
              return;
            }

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Student record deleted successfully!',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              customClass: {
                popup: 'swal-high-zindex'
              }
            });

            this.getStudents();
            // this.router.navigate(['/students']);
          }
        });
      }
    });
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {

    if (e.format === 'pdf') {

      console.log("pdfffffff");

      const doc = new jsPDF();

      exportPdf({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,

        columnWidths: [
          15,
          30,
          30,
          55,
          18,
          25,
        ],
      }).then(() => {
        doc.save("StudentList.pdf");
      });

      e.cancel = true;
    }
    else {

      console.log("excelllllll");

      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('Students');

      exportExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      } as any).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            'StudentList.xlsx'
          );
        });
      });

      e.cancel = true;
    }
  }

  onCancel() {
    // this.isPopupVisible = false;
  }
}
