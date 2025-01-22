import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TP05';
  isSidebarDisplay = false;

  openSidebar() {
    this.isSidebarDisplay = !this.isSidebarDisplay;
  }

  closeSidebar() {
    this.isSidebarDisplay = false;
  }
}