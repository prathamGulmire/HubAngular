import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { StudentService } from './student.service';
import { Subject } from 'rxjs';

export interface IUser {
  email: string;
  studentId: number;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'authUser';
  private _user: IUser | null = null;

  private authChanged = new Subject<void>();
  authChanged$ = this.authChanged.asObservable();

  notifyAuthChanged() {
    this.authChanged.next();
  }

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

  handleLoginSuccess(email: string, studentId: number, role: 'user' | 'admin') {
    this._user = { email, studentId, role };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._user));
  }

  getUser(): IUser | null {
    const user = localStorage.getItem(this.STORAGE_KEY);
    if (user) {
      this._user = JSON.parse(user);
    }
    // console.log("_user: ", this._user);
    return this._user;
  }

  isAdmin(): boolean {
    return this._user?.role === 'admin';
  }

  isUser(): boolean {
    return this._user?.role === 'user';
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
    this.router.navigateByUrl('/login-form', { replaceUrl: true })
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // if (this.authService.loggedIn) {
    //   return true;
    // }

    // this.router.navigate(['/login-form']);
    // return false;

    const user = this.authService.getUser();
    const allowedRoles = route.data['roles'] as string[];

    if (!user) {
      this.router.navigate(['/login-form']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    this.router.navigate(['/profile']);

    // // Unauthorized
    // this.router.navigate(['/unauthorized']);
    return false;
  }
}