import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Event {
  id: number;
  nome: string;
  dataInicio: string;
  dataFinal: string;
  horarioInicio: string;
  horarioFinal: string;
  local: string;
  descricao: string;
  imagem?: string;
}

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {

  event: Event | undefined;

  private allEvents: Event[] = [
    { id: 1, nome: 'Festa Junina', dataInicio: '2025-06-20', dataFinal: '2025-06-22', horarioInicio: '18:00', horarioFinal: '23:00', local: 'Sede Campestre II', descricao: 'Tradicional festa com comidas típicas, danças e brincadeiras.', imagem: 'assets/img/banner-1.jpg' },
    { id: 2, nome: 'Bon Odori', dataInicio: '2025-08-15', dataFinal: '2025-08-16', horarioInicio: '19:00', horarioFinal: '22:00', local: 'Praça Kasato Maru', descricao: 'Festival de dança folclórica japonesa em homenagem aos antepassados.', imagem: 'assets/activities/fujin-bu.jpg' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const eventId = +idParam;
      this.event = this.allEvents.find(evt => evt.id === eventId);

      if (!this.event) {
        this.router.navigate(['/list-events']);
      }
    }
  }
}