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
      nome: ['', Validators.required],
      cognome: [''],
      cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
      rg: ['', [ Validators.pattern(/^[0-9]*$/)]],
      dataNascimento: ['', [Validators.required, CustomValidators.minAgeValidator(1)]],
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      nomePai: [''],
      nomeMae: [''],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      complemento: [''],
      localNascimento: [''],
      nacionalidade: ['', Validators.required],
      grauInstrucao: [''],
      profissao: [''],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      situacao: ['Regular']
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