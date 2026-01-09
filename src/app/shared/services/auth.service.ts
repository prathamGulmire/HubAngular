import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { StudentService } from './student.service';

export interface IUser {
  email: string;
  studentId: number;
}

const defaultPath = '/';
const defaultUser = {
  email: 'sandra@example.com',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'authUser';
  private _user: IUser | null = null;

  constructor(private router: Router, private studentService: StudentService) {

    const savedUser = localStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      this._user = JSON.parse(savedUser);
    }
  }

  get loggedIn(): boolean {
    return !!this._user;
  }

  get user(): IUser | null {
    return this._user;
  }

  logIn(email: string, password: string) {
    return this.studentService.login({ email, password });
  }

  handleLoginSuccess(email: string, studentId: number) {
    this._user = { email, studentId };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._user));
  }

  getUser(): IUser | null {
    return this._user;
  }

  async createAccount(email: string, password: string) {
    try {
      // Send request

      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  logOut() {
    this._user = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login-form']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.loggedIn) {
      return true;
    }

    this.router.navigate(['/login-form']);
    return false;
  }
}