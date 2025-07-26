import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('institutionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('headquartersBtn', { read: MatMenuTrigger }) headquartersTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;
}

