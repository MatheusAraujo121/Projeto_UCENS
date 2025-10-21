import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { CustomValidators } from 'src/app/validators/custom-validators'; // Importe os validadores

@Component({
  selector: 'app-create-associates',
  templateUrl: './create-associates.component.html',
  styleUrls: ['./create-associates.component.scss']
})
export class CreateAssociatesComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private associateService: AssociateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient // Injete o HttpClient
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      cognome: ['', [Validators.maxLength(100)]],
      cpf: ['', [Validators.required, CustomValidators.cpfValidator(), Validators.maxLength(14)]],
      rg: ['', [Validators.pattern(/^[0-9]*$/), Validators.maxLength(30)]],
      dataNascimento: ['', [Validators.required, CustomValidators.minAgeValidator(1)]],
      sexo: ['', [Validators.required, Validators.maxLength(10)]],
      estadoCivil: ['', [Validators.required, Validators.maxLength(30)]],
      nomePai: ['', [Validators.maxLength(150)]],
      nomeMae: ['', [Validators.maxLength(150)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/), Validators.maxLength(10)]],
      endereco: ['', [Validators.required, Validators.maxLength(200)]],
      bairro: ['', [Validators.required, Validators.maxLength(100)]],
      cidade: ['', [Validators.required, Validators.maxLength(100)]],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      numero: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(10)]],
      complemento: ['', [Validators.maxLength(50)]],
      localNascimento: ['', [Validators.maxLength(100)]],
      nacionalidade: ['', [Validators.required, Validators.maxLength(100)]],
      grauInstrucao: ['', [Validators.maxLength(100)]],
      profissao: ['', [Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      situacao: ['Regular', [Validators.maxLength(30)]]
    });
  }

  /**
   * Busca o CEP na API ViaCEP e preenche os campos de endereço.
   */
  buscarCep() {
    const cepControl = this.form.get('cep');
    if (cepControl?.valid && cepControl.value) {
      const cep = cepControl.value.replace(/\D/g, ''); // Remove caracteres não numéricos
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

  efetuarCadastro() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, verifique os campos com erro.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const novoAssociado = this.form.value;
    this.associateService.createAssociate(novoAssociado).subscribe({
      next: (response) => {
        this.snackBar.open('Associado cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-associates']);
      },
      error: (err) => {
        this.snackBar.open('Erro ao cadastrar. Verifique os dados e se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}