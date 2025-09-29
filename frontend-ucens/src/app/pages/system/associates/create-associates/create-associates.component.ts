import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importe o Router
import { AssociateService } from 'src/app/services/associates/associate.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-associates',
  templateUrl: './create-associates.component.html',
  styleUrls: ['./create-associates.component.scss']
})
export class CreateAssociatesComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  // Injete o Router e o AssociateService no construtor
  constructor(
    private fb: FormBuilder,
    private associateService: AssociateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
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
      situacao: ['Regular']
    });
  }

  efetuarCadastro() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    // Se o formulário for válido, chama o serviço para criar o associado
    const novoAssociado = this.form.value;
console.log('Dados que serão enviados para o backend:', novoAssociado);
    this.associateService.createAssociate(novoAssociado).subscribe({
      next: (response) => {
        // Callback de sucesso
        this.snackBar.open('Associado cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        // Navega para a lista de associados após o sucesso
        this.router.navigate(['/list-associates']);
      },
      error: (err) => {
        // Callback de erro
        this.snackBar.open('Erro ao cadastrar. Verifique os dados e se você está logado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}