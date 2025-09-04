import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  previewUrl: string | null = null;
  
  sedes: string[] = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II', 'Praça Kasato Maru'];
  filteredOptions!: Observable<string[]>;

  private allEvents: Event[] = [
    { id: 1, nome: 'Festa Junina', dataInicio: '2025-06-20', dataFinal: '2025-06-22', horarioInicio: '18:00', horarioFinal: '23:00', local: 'Sede Campestre II', descricao: 'Tradicional festa com comidas típicas, danças e brincadeiras.', imagem: 'assets/img/banner-1.jpg' },
    { id: 2, nome: 'Bon Odori', dataInicio: '2025-08-15', dataFinal: '2025-08-16', horarioInicio: '19:00', horarioFinal: '22:00', local: 'Praça Kasato Maru', descricao: 'Festival de dança folclórica japonesa em homenagem aos antepassados.', imagem: 'assets/activities/fujin-bu.jpg' },
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    const eventToEdit = this.allEvents.find(e => e.id === this.id);

    if (eventToEdit) {
      this.previewUrl = eventToEdit.imagem || null;
      this.buildForm(eventToEdit);
    } else {
      this.router.navigate(['/list-events']);
    }
  }

  private buildForm(event: Event): void {
    this.form = this.fb.group({
      nome: [event.nome, Validators.required],
      dataInicio: [event.dataInicio, Validators.required],
      dataFinal: [event.dataFinal, Validators.required],
      horarioInicio: [event.horarioInicio, Validators.required],
      horarioFinal: [event.horarioFinal, Validators.required],
      local: [event.local, Validators.required],
      descricao: [event.descricao],
      imagem: [null]
    });

    this.filteredOptions = this.form.get('local')!.valueChanges.pipe(
      startWith(event.local || ''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.sedes.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  atualizar(): void {
    if (this.form.valid) {
      console.log('Dados atualizados do Evento:', this.form.value);
      alert('Evento atualizado com sucesso! (Simulação)');
      this.router.navigate(['/list-events']); // ou para a página de visualização do evento
    } else {
      this.form.markAllAsTouched();
    }
  }
}