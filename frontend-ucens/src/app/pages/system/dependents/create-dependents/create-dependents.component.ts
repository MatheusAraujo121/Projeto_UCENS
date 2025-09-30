import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Dependent } from 'src/app/services/dependents/dependent.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-dependents',
  templateUrl: './create-dependents.component.html',
  styleUrls: ['./create-dependents.component.scss']
})
export class CreateDependentsComponent implements OnInit {
  form!: FormGroup;
  associates: Associate[] = [];
  associateFilterCtrl = new FormControl<string | Associate>('');
  filteredAssociates!: Observable<Associate[]>;

  constructor(
    private fb: FormBuilder,
    private dependentService: DependentService,
    private associateService: AssociateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      associadoId: [null, Validators.required],
      situacao: ['Regular', Validators.required],
      grauParentesco: ['', Validators.required],
      exames: [''],
      atividadesProibidas: [''],
      carteirinha: this.fb.group({
        nome: ['', Validators.required],
        cognome: [''],
        numero: [''],
        categoria: [''],
        validade: [''],
      }),
      sexo: ['', Validators.required],
      cpf: ['', [Validators.minLength(11)]],
      rg: ['', [Validators.minLength(9)]],
      dataNascimento: ['', Validators.required],
      localNascimento: [''],
      nacionalidade: [''],
      estadoCivil: [''],
      grauInstrucao: [''],
      profissao: [''],
    });

    this.loadAssociates();
  }

  loadAssociates(): void {
    this.associateService.getAssociados().subscribe(associates => {
      this.associates = associates;
      this.filteredAssociates = this.associateFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.nome;
          return name ? this._filterAssociates(name) : this.associates.slice();
        })
      );
    });
  }

  private _filterAssociates(name: string): Associate[] {
    const filterValue = name.toLowerCase();
    return this.associates.filter(associate => associate.nome.toLowerCase().includes(filterValue));
  }

  displayAssociateName(associate: Associate): string {
    return associate && associate.nome ? associate.nome : '';
  }

  onAssociateSelected(associate: Associate): void {
    this.form.get('associadoId')?.setValue(associate);
  }

  efetuarCadastro(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const payload: Partial<Dependent> = {
      nome: formValue.carteirinha.nome,
      cognome: formValue.carteirinha.cognome,
      dataNascimento: formValue.dataNascimento,
      sexo: formValue.sexo,
      cpf: formValue.cpf,
      rg: formValue.rg,
      estadoCivil: formValue.estadoCivil,
      grauInstrucao: formValue.grauInstrucao,
      localNascimento: formValue.localNascimento,
      nacionalidade: formValue.nacionalidade,
      profissao: formValue.profissao,
      associadoId: formValue.associadoId.id,
      situacao: formValue.situacao,
      grauParentesco: formValue.grauParentesco,
      numeroCarteirinha: formValue.carteirinha.numero,
      categoria: formValue.carteirinha.categoria,
      validadeCarteirinha: formValue.carteirinha.validade ? formValue.carteirinha.validade : null,
      exames: formValue.exames,
      atividadesProibidas: formValue.atividadesProibidas
    };

    this.dependentService.createDependent(payload).subscribe({
      next: () => {
        this.snackBar.open('Dependente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-dependents']);
      },
      error: (err) => {
        this.snackBar.open('Ocorreu um erro ao tentar cadastrar o dependente. Verifique os dados e tente novamente.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
