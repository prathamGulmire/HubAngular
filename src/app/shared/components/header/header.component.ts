import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { AuthService, IUser } from '../../services';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelComponent,
    DxToolbarModule,
    ThemeSwitcherComponent,
  ],

  // providers: [AuthService, Router]
})

export class HeaderComponent implements OnInit {

  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: IUser | null = null;

  userMenuItems = [{
    text: 'Profile',
    icon: 'user',
    onClick: () => {
      this.router.navigate(['/profile']);
    }
  },
  {
    text: 'Logout',
    icon: 'runner',
    onClick: () => {
      if(confirm("You really want to logout, huh?")) {
        this.authService.logOut();
      }
    }
  }];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  }
}