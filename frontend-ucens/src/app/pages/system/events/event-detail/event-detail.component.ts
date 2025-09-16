import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: EventApi },
    private dialogRef: MatDialogRef<EventDetailComponent>,
    private router: Router
  ) { }

  viewEvent(): void {
    this.dialogRef.close(); 
    this.router.navigate(['/view-event', this.data.event.id]); 
  }
}