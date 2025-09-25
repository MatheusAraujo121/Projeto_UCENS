import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core'; // Usado para tipar o evento do calendário

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: EventApi }, // Recebe os dados do calendário
    private router: Router
  ) {}

  viewEvent(): void {
    const eventId = this.data.event.id;
    this.dialogRef.close(); // Fecha o modal
    // Navega para a página de detalhes completa (que ainda vamos criar/integrar)
    this.router.navigate(['/view-event', eventId]);
  }
}