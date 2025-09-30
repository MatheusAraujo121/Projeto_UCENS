import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { FileUploadService } from 'src/app/services/uploads/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atividade } from 'src/app/services/activities/activity.interface';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {

  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  activityId: number | null = null;

  categorias = ['Esportivo', 'Cultural'];
  diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  sedes = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II'];

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      descricao: [''],
      imagemUrl: [''],
      exigePiscina: [false],
      exigeFisico: [false],
      categoria: ['', Validators.required],
      diasDisponiveis: [[]],
      horarioSugerido: [''],
      idadeMinima: [null],
      idadeMaxima: [null],
      limiteParticipantes: [null],
      local: [[]],
      professorResponsavel: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.activityId = +idParam;
      this.loadActivityData(this.activityId);
    }
  }

  loadActivityData(id: number): void {
    this.isLoading = true;
    this.atividadeService.getById(id).subscribe({
      next: (data: Atividade) => {
        this.form.patchValue(data);
        this.previewUrl = data.imagemUrl || null; 
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar dados da atividade.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-activities']);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.previewUrl = reader.result;
    }
  }

  efetuarAtualizacao(): void {
    if (this.form.invalid || !this.activityId) {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'activities').subscribe({
        next: (response) => {
          this.form.patchValue({ imagemUrl: response.url });
          this.atualizarAtividade();
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao enviar a nova imagem.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.atualizarAtividade();
    }
  }

  private atualizarAtividade(): void {
    if (!this.activityId) return;

    this.atividadeService.update(this.activityId, this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Atividade atualizada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-activities']);
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar. Verifique os dados e se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}