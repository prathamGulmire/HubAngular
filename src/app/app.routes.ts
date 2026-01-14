import { Routes } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { AddCourseComponent } from './pages/course-pages/add-course/add-course.component';
import { CourseListComponent } from './pages/course-pages/course-list/course-list.component';
import { AssignCourseComponent } from './pages/student-course/assign-course/assign-course.component';
import { UnassignCourseComponent } from './pages/student-course/unassign-course/unassign-course.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: TasksComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['user', 'admin']}
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'home/:id',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    // canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    // canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    // canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    // canActivate: [ AuthGuardService ]
  },
  {
    path: 'addCourse',
    component: AddCourseComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: "courses",
    component: CourseListComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'assignCourse',
    component: AssignCourseComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'unassignCourse',
    component: UnassignCourseComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  // {
  //   path: '**',
  //   redirectTo: 'home'
  // }
];