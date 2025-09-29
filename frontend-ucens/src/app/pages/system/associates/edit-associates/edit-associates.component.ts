import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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
      situacao: ['', Validators.required]
    });
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
          const dateString = data.dataNascimento;
          const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
          const localDate = new Date(year, month - 1, day);
          this.form.patchValue({
            ...data,
            dataNascimento: localDate
          });
        }
      },
      error: (err) => {
        this.snackBar.open('Associado não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-associates']);
      }
    });
  }

  atualizar() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    if (this.id) {
      const updatedData = { ...this.form.value, id: this.id };
      this.associateService.updateAssociate(this.id, updatedData).subscribe({
        next: () => {
          this.snackBar.open('Associado atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/view-associates', this.id]);
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao tentar atualizar os dados. Por favor, tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}