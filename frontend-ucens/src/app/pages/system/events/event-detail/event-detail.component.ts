import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core'; 

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: EventApi }, 
    private router: Router
  ) {}

  viewEvent(): void {
    const eventId = this.data.event.id;
    this.dialogRef.close(); 
    this.router.navigate(['/view-event', eventId]);
  }
}