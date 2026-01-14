import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule,
  ]
})
export class LoginFormComponent implements OnInit {
  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log("Login form component!");
    const res = this.authService.getUser();
    if (res && res.studentId > 0) {
      if(this.authService.isAdmin()) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/profile"]);
      }
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = this.formData;

    this.loading = true;

    this.authService.logIn(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.authService.handleLoginSuccess(email, res[0].id, res[0].role);
        if(this.authService.isAdmin()) {
          this.router.navigate(["/login-form"]);
        } else {
          this.router.navigate(["/profile"]);
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Login failed');
        this.loading = false;
      }
    });
  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  }
}