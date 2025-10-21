import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { CustomValidators } from 'src/app/validators/custom-validators';

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
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      cognome: ['', [Validators.maxLength(100)]],
      cpf: ['', [Validators.required, CustomValidators.cpfValidator(), Validators.maxLength(14)]],
      rg: ['', [ Validators.pattern(/^[0-9]*$/), Validators.maxLength(30)]],
      dataNascimento: ['', [Validators.required, CustomValidators.minAgeValidator(1)]],
      sexo: ['', [Validators.required, Validators.maxLength(10)]],
      estadoCivil: ['', [Validators.required, Validators.maxLength(30)]],
      nomePai: ['', [Validators.maxLength(150)]],
      nomeMae: ['', [Validators.maxLength(150)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/), Validators.maxLength(10)]],
      endereco: ['', [Validators.required, Validators.maxLength(200)]],
      numero: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(10)]],
      complemento: ['', [Validators.maxLength(50)]],
      bairro: ['', [Validators.required, Validators.maxLength(100)]],
      cidade: ['', [Validators.required, Validators.maxLength(100)]],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      localNascimento: ['', [Validators.maxLength(100)]],
      nacionalidade: ['', [Validators.required, Validators.maxLength(100)]],
      grauInstrucao: ['', [Validators.maxLength(100)]],
      profissao: ['', [Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      situacao: ['', [Validators.required, Validators.maxLength(30)]]
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
          this.form.patchValue({
            ...data,
            // Corrige o formato da data para o DatePicker do Material
            dataNascimento: new Date(data.dataNascimento) 
          });
        }
      },
      error: (err) => {
        this.snackBar.open('Associado não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-associates']);
      }
    });
  }

  buscarCep() {
    const cepControl = this.form.get('cep');
    if (cepControl?.valid && cepControl.value) {
      const cep = cepControl.value.replace(/\D/g, '');
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((dados: any) => {
        if (dados && !dados.erro) {
          this.form.patchValue({
            endereco: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            uf: dados.uf
          });
          this.snackBar.open('Endereço preenchido automaticamente!', 'Fechar', { duration: 2000 });
        } else {
          this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 3000 });
        }
      }, error => {
        this.snackBar.open('Erro ao buscar o CEP.', 'Fechar', { duration: 3000 });
      });
    }
  }

  atualizar() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, verifique os campos com erro.', 'Fechar', { duration: 3000 });
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