import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { AuthService } from '../../services';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  standalone: true,
  imports: [
    DxListModule,
    DxContextMenuModule,
    DxDropDownButtonModule,
    CommonModule
  ]
})
export class UserPanelComponent implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode = 'context';

  student: any;
  imageBaseUrl = "https://localhost:7262/uploads/";

  constructor(private auth: AuthService, private stud: StudentService) { }

  ngOnInit(): void {
    
    const res = this.auth.getUser();

    this.stud.getStudent(res?.studentId).subscribe((response) => {
      this.student = response[0];

      this.imageBaseUrl += this.student.imageUrl;
    });
  }
}
