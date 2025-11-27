import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { FileUploadService } from 'src/app/services/uploads/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  categorias = ['Esportivo', 'Cultural'];
  diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  sedes = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II', 'Outros'];

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(1000), Validators.required]],
      imagemUrl: [''],
      imagemFileId: [''],
      exigePiscina: [false],
      exigeFisico: [false],
      categoria: ['', [Validators.required, Validators.maxLength(50)]],
      diasDisponiveis: [[], Validators.required],
      horarioSugerido: ['', Validators.required],
      idadeMinima: [null, Validators.required, Validators.min(0)],
      idadeMaxima: [null, Validators.required, Validators.min(0)],
      limiteParticipantes: [null, Validators.required, Validators.min(0)],
      local: [[], Validators.required],
      professorResponsavel: ['', [Validators.maxLength(150), Validators.required]]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.previewUrl = reader.result;
    }
  }

  efetuarCadastro(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'activities').subscribe({
        next: (response) => {
          this.form.patchValue({ imagemUrl: response.url,
            imagemFileId: response.fileId });
          this.cadastrarAtividade();
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao enviar a imagem.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }else {
        
        
        this.snackBar.open('Por favor, selecione uma imagem.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
    }
  }

  private cadastrarAtividade(): void {
    this.atividadeService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Atividade cadastrada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-activities']);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao cadastrar. Verifique os dados e se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}