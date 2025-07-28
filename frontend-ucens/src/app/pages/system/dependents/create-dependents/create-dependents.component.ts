import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-dependents',
  templateUrl: './create-dependents.component.html',
  styleUrls: ['./create-dependents.component.scss']
})
export class CreateDependentsComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      idAssociado: ['', Validators.required],
      situacao: ['', Validators.required],
      grauParentesco: ['', Validators.required],
      dataLimite: ['', Validators.required],
      exames: [''],
      atividadesProibidas: [''],
      // carteirinha é um grupo aninhado
      carteirinha: this.fb.group({
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        numero: ['', Validators.required],
        categoria: ['', Validators.required],
        validade: ['', Validators.required],
      }),
      sexo: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      rg: ['', [Validators.required, Validators.minLength(12)]],
      dataNascimento: ['', Validators.required],
      localNascimento: ['', Validators.required],
      nacionalidade: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      grauInstrucao: ['', Validators.required],
      profissao: ['', Validators.required],
    });
  }

  efetuarCadastro() {
    if (this.form.valid) {
      console.log(this.form.value);
      // chamar serviço...
    } else {
      this.form.markAllAsTouched();
    }
  }
}
