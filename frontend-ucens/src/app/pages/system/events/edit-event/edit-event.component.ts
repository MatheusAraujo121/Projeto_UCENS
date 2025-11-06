import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/events/event.service';
import { FileUploadService } from 'src/app/services/uploads/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Evento } from 'src/app/services/events/event.interface';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  eventId: number | null = null;
  
  sedes: string[] = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II', 'Parque Kasato Maru'];
  filteredOptions!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      local: ['', [Validators.required, Validators.maxLength(150)]],
      dataInicio: ['', Validators.required],
      horarioInicio: ['', Validators.required],
      dataFinal: ['', Validators.required],
      horarioFinal: ['', Validators.required],
      descricao: ['', [Validators.maxLength(1000), Validators.required]],
      imagemUrl: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = +idParam;
      this.loadEventData(this.eventId);
    }

    this.filteredOptions = this.form.get('local')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.sedes.filter(option => option.toLowerCase().includes(filterValue));
  }

  loadEventData(id: number): void {
    this.isLoading = true;
    this.eventoService.getById(id).subscribe({
      next: (data: Evento) => {
        const inicio = new Date(data.inicio);
        const fim = new Date(data.fim);

        this.form.patchValue({
          ...data,
          dataInicio: inicio,
          horarioInicio: this.formatTime(inicio),
          dataFinal: fim,
          horarioFinal: this.formatTime(fim)
        });
        this.previewUrl = data.imagemUrl || null;
        this.isLoading = false;
      },
      error: () => this.router.navigate(['/list-events'])
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
       this.form.patchValue({ imagemUrl: file.name });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.previewUrl = reader.result;
    }
  }

  efetuarAtualizacao(): void {
    if (this.form.invalid || !this.eventId) {
        this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
        return;
    }
    this.isLoading = true;

    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'events').subscribe({
        next: (response) => {
          this.form.patchValue({ imagemUrl: response.url });
          this.atualizarEvento();
        },
        error: () => {
          this.snackBar.open('Ocorreu um erro ao enviar a nova imagem.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.atualizarEvento();
    }
  }

  private atualizarEvento(): void {
    if (!this.eventId) return;
    
    const formValue = this.form.value;
    const dataInicioCompleta = this.combineDateAndTime(formValue.dataInicio, formValue.horarioInicio);
    const dataFinalCompleta = this.combineDateAndTime(formValue.dataFinal, formValue.horarioFinal);

    const eventoParaSalvar = {
      ...formValue,
      inicio: dataInicioCompleta,
      fim: dataFinalCompleta
    };

    this.eventoService.update(this.eventId, eventoParaSalvar).subscribe({
      next: () => {
        this.snackBar.open('Evento atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-events']);
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar. Verifique se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  private formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    
    return newDate;
  }
}