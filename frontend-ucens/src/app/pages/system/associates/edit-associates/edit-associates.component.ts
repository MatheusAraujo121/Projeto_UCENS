import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';

@Component({
  selector: 'app-edit-associates',
  templateUrl: './edit-associates.component.html',
  styleUrls: ['./edit-associates.component.scss']
})
export class EditAssociatesComponent implements OnInit {
  id: number | null = null;
  form!: FormGroup;
  associado: Associate | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private associateService: AssociateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializa o formulário com todos os campos e validadores
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cognome: [''],
      cpf: ['', [Validators.minLength(11)]],
      rg: ['', [Validators.minLength(9)]],
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      nomePai: [''],
      nomeMae: [''],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      localNascimento: [''],
      nacionalidade: ['', Validators.required],
      grauInstrucao: [''],
      profissao: [''],
      telefone: ['', [Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      // É uma boa prática definir um status padrão para novos associados
      situacao: ['', Validators.required]
    });

    // Pega o ID da rota e carrega os dados do associado
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadAssociadoData(this.id);
    }
  }

  loadAssociadoData(id: number): void {
    this.associateService.getAssociado(id).subscribe({
      next: (data) => {
        if (data) {
          this.associado = data;
          const formattedDate = data.dataNascimento.split('T')[0];
          this.form.patchValue({
            ...data,
            dataNascimento: formattedDate
          });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados do associado:', err);
        alert('Associado não encontrado.');
        this.router.navigate(['/list-associates']);
      }
    });
  }

  /**
   * Envia os dados atualizados do formulário para o backend.
   */
  atualizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.id) {
      // Combina os valores do formulário com o ID original para enviar ao backend
      const updatedData = { ...this.form.value, id: this.id };

      this.associateService.updateAssociate(this.id, updatedData).subscribe({
        next: () => {
          alert('Associado atualizado com sucesso!');
          this.router.navigate(['/view-associates', this.id]);
        },
        error: (err) => {
          console.error('Erro ao atualizar associado:', err);
          alert('Ocorreu um erro ao tentar atualizar os dados. Por favor, tente novamente.');
        }
      });
    }
  }
}