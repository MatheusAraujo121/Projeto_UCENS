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
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(1000), Validators.required]],
      imagemUrl: [''],
      // PASSO 1: Adicione o 'imagemFileId' ao formulário
      imagemFileId: [''], 
      exigePiscina: [false],
      exigeFisico: [false],
      categoria: ['', [Validators.required, Validators.maxLength(50)]],
      diasDisponiveis: [[], Validators.required],
      horarioSugerido: ['', Validators.required],
      idadeMinima: [null, Validators.required],
      idadeMaxima: [null, Validators.required],
      limiteParticipantes: [null, Validators.required],
      local: [[], Validators.required],
      professorResponsavel: ['', [Validators.maxLength(150), Validators.required]]
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
        // Agora que o form tem 'imagemFileId', este patchValue
        // irá preencher Corretamente o 'fileId' original.
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
      
      // Opcional: Se o usuário selecionar um novo arquivo,
      // é uma boa prática já limpar o 'fileId' antigo,
      // pois ele será substituído.
      // this.form.patchValue({ imagemFileId: null });
    }
  }

  efetuarAtualizacao(): void {
    if (this.form.invalid || !this.activityId) {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    // Caso 1: Usuário selecionou um NOVO arquivo de imagem
    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'activities').subscribe({
        next: (response) => {
          // PASSO 2: Salve 'url' E 'fileId' da resposta
          this.form.patchValue({ 
            imagemUrl: response.url,
            imagemFileId: response.fileId
          });
          // Agora o form.value está com a NOVA imagem
          this.atualizarAtividade();
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao enviar a nova imagem.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      // Caso 2: Usuário NÃO mexeu na imagem
      // O form.value já contém o 'imagemUrl' e 'imagemFileId' originais
      // (pois foram carregados no loadActivityData e o form foi corrigido)
      this.atualizarAtividade();
    }
  }

  private atualizarAtividade(): void {
    if (!this.activityId) return;

    // this.form.value agora envia o 'imagemFileId' correto:
    // - O 'fileId' NOVO se a imagem foi trocada.
    // - O 'fileId' ANTIGO se a imagem não foi trocada.
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