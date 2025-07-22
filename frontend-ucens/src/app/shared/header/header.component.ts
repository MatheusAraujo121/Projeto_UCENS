import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('institucionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('sedesBtn', { read: MatMenuTrigger }) sedesTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;
}

