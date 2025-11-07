import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/events/event.service';
import { FileUploadService } from 'src/app/services/uploads/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  sedes: string[] = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II', 'Parque Kasato Maru'];
  filteredOptions!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      dataInicio: ['', Validators.required],
      dataFinal: ['', Validators.required],
      horarioInicio: ['', Validators.required],
      horarioFinal: ['', Validators.required],
      local: ['', [Validators.required, Validators.maxLength(150)]],
      descricao: ['', [Validators.maxLength(1000), Validators.required]],
      imagemUrl: ['']
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.form.get('local')!.valueChanges.pipe(
      startWith(''),
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
      this.selectedFile = file;
      // Define o valor do formControl para ter um valor, mesmo que a URL real venha depois
      this.form.patchValue({ imagemUrl: file.name });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.previewUrl = reader.result;
    }
  }

  efetuarCadastro(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }
    this.isLoading = true;

    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'events').subscribe({
        next: (response) => {
          this.form.patchValue({ imagemUrl: response.url });
          this.cadastrarEvento();
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao enviar a imagem.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      // Se não houver arquivo selecionado, mas o campo for obrigatório, mostra erro
      if (this.form.get('imagemUrl')?.hasError('required')) {
         this.snackBar.open('A imagem do evento é obrigatória.', 'Fechar', { duration: 3000 });
         this.isLoading = false;
         return;
      }
      this.cadastrarEvento();
    }
  }

  private cadastrarEvento(): void {
    const formValue = this.form.value;
    const dataInicioCompleta = this.combineDateAndTime(formValue.dataInicio, formValue.horarioInicio);
    const dataFinalCompleta = this.combineDateAndTime(formValue.dataFinal, formValue.horarioFinal);

    const eventoParaSalvar = {
      ...formValue,
      inicio: dataInicioCompleta,
      fim: dataFinalCompleta
    };

    this.eventoService.create(eventoParaSalvar).subscribe({
      next: () => {
        this.snackBar.open('Evento cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-events']);
      },
      error: (error) => {
        this.snackBar.open('Erro ao cadastrar. Verifique os dados e se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    
    return newDate;
  }
}