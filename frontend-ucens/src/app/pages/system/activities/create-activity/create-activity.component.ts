import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {
  form!: FormGroup;
  previewUrl: string | null = null;
  diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  categorias = ['Esportiva', 'Cultural'];
  sedes = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II'];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      descricao: [''],
      exigePiscina: [false],
      exigeFisico: [false],
      categoria: [''],
      diasDisponiveis: [[]],
      horarioSugerido: [''],
      idadeMinima: [''],
      idadeMaxima: [''],
      limiteParticipantes: [''],
      local: [''],
      professorResponsavel: ['']
    });
  }

   onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  efetuarCadastro() {
    if (this.form.valid) {
      console.log(this.form.value);
      // TODO: chamar serviço para salvar
    } else {
      this.form.markAllAsTouched();
    }
  }
}
