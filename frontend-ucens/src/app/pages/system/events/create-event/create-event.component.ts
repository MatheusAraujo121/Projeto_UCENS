import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  form!: FormGroup;
  previewUrl: string | null = null;
  
  sedes: string[] = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II', 'Praça Kasato Maru'];
  
  filteredOptions!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFinal: ['', Validators.required],
      horarioInicio: ['', Validators.required],
      horarioFinal: ['', Validators.required],
      local: ['', Validators.required],
      descricao: [''],
      imagem: [null]
    });

    this.filteredOptions = this.form.get('local')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.sedes.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  efetuarCadastro(): void {
    if (this.form.valid) {
      console.log('Dados do Evento:', this.form.value);
      alert('Evento cadastrado com sucesso! (Simulação)');
      this.router.navigate(['/list-events']); 
    } else {
      this.form.markAllAsTouched();
    }
  }
}