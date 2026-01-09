import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'Hub4';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}