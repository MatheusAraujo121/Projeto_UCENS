import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-associates',
  templateUrl: './create-associates.component.html',
  styleUrls: ['./create-associates.component.scss']
})
export class CreateAssociatesComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(14)]], 
      rg: ['', [Validators.required, Validators.minLength(12)]], 
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      nomePai: ['', Validators.required],
      nomeMae: ['', Validators.required],
      localNascimento: ['', Validators.required],
      nacionalidade: ['', Validators.required],
      grauInstrucao: ['', Validators.required],
      profissao: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(15)]], 
      email: ['', [Validators.required, Validators.email]],
    });
  }

  efetuarCadastro() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
