import { Component, OnInit } from '@angular/core';
import { DepartmentService, IDepartment } from '../../../../shared/services/department.service';
import { DxDataGridModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import {jsPDF} from 'jspdf';
import { exportDataGrid as exportExcel } from 'devextreme/common/export/excel';
import { exportDataGrid as exportPdf } from 'devextreme/common/export/pdf';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import ExcelJs from 'exceljs';
import saveAs from 'file-saver';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
  standalone: true,
  imports: [DxDataGridModule]
})
export class DepartmentListComponent implements OnInit {

  departments: any;

  isInsertMode: boolean = false;

  constructor(
    private deptService: DepartmentService
  ) { }

  ngOnInit(): void {

    this.getDepartments(0);
  }

  getDepartments(id: any) {
    this.deptService.getDepartment(id).subscribe((res) => {
      if (res.isSuccess) {
        this.departments = res.data;
        console.log(this.departments);
      } else {
        alert(res.message);
        return;
      }
    });
  }

  initNewRow(e: any) {

    this.isInsertMode = true;
  }

  onEdit(e: any) {

    this.isInsertMode = false;

    console.log(e.data.departmentId);
  }

  insertRow(e: any) {
    console.log(e.data);

    const payload = {
      departmentName: e.data.departmentName
    }

    this.deptService.addDepartment(payload).subscribe((res) => {
      if (res.isSuccess) {
        alert(res.message);
        this.getDepartments(0);
      }
      else {
        alert(res.message);
        return;
      }
    });
  }

  updateRow(e: any) {

    // console.log(e.data); //prints undefined

    console.log(e.oldData);

    const payload = {
      departmentId: e.oldData.departmentId,
      departmentName: e.newData.departmentName
    };

    this.deptService.updateDepartment(payload).subscribe((res) => {
      if (res.isSuccess) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.message || 'Student updated successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.getDepartments(0);
      }
      else {
        alert(res.message);
        return;
      }
    });

    console.log(payload);
  }

  removeRow(e: any) {

    console.log(e.data);

    const did = e.data.departmentId;

    e.cancel = true;

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
        this.deptService.deleteDepartment(did).subscribe({

          next: (res) => {
            // console.log(res);
            if (!res.isSuccess) {
              Swal.fire({
                icon: 'info',
                title: "Can't delete.",
                text: res.message,
                showConfirmButton: false,
                timer: 2000,
              });
              return;
            }
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              customClass: {
                popup: 'swal-high-zindex'
              }
            });

            this.getDepartments(0);
          },

          error: (e) => {
            console.log(e);
            Swal.fire({
              icon: 'info',
              title: "Can't delete.",
              text: e.error.data,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      }
    });
  }

  onExport(e: DxDataGridTypes.ExportingEvent) {

    if(e.format === 'pdf') {

      console.log("pdffffff");

      const doc = new jsPDF();

      exportPdf({

        jsPDFDocument: doc,
        component: e.component,
        indent: 2,
      }).then(() => {
        doc.save("DepartmentList.pdf");
      });

      e.cancel = true;
    }
    else {

      console.log("excellllllll");

      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('Departments');

      exportExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      } as any).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], {type: 'application/octet-stream'}),
            'Department-list.xlsx'
          );
        });
      });

      e.cancel = true;
    }
  }

}