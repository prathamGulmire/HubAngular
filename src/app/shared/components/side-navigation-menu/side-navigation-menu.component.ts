import { Component, Output, Input, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { navigation } from '../../../app-navigation';

import * as events from 'devextreme-angular/common/core/events';
import { AuthService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
  standalone: true,
  imports: [DxTreeViewModule]
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  private _selectedItem!: String;
  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(value);
  }

  private authSub!: Subscription;

  private _items!: Record<string, unknown>[];
  get items() {
    const user = this.authService.getUser();
    const role = user?.role;

    if (!this._items) {
      const filteredNav = role
        ? this.filterNavigationByRole(navigation, role)
        : [];

      this._items = filteredNav.map(item => {
        if (item.path && !item.path.startsWith('/')) {
          item.path = `/${item.path}`;
        }
        return { ...item, expanded: !this._compactMode };
      });
    }

    return this._items;
  }

  private _compactMode = false;
  @Input()
  get compactMode() {
    return this._compactMode;
  }
  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  constructor(private elementRef: ElementRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.authChanged$.subscribe(() => {
      this.resetMenu();
    });
  }

  private filterNavigationByRole(
    items: any[],
    role: string
  ): any[] {
    return items
      .filter(item => !item.roles || item.roles.includes(role))
      .map(item => {
        const newItem = { ...item };

        if (item.items) {
          newItem.items = this.filterNavigationByRole(item.items, role);
        }

        // Remove empty folders
        if (newItem.items && newItem.items.length === 0) {
          delete newItem.items;
        }

        return newItem;
      });
  }

  resetMenu() {
    this._items = undefined!;
    this.menu?.instance?.option('items', this.items);
  }


  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}
