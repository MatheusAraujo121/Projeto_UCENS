import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Serviços e Interfaces
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Dependent } from 'src/app/services/dependents/dependent.interface';

// Validador Customizado
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-create-dependents',
  templateUrl: './create-dependents.component.html',
  styleUrls: ['./create-dependents.component.scss']
})
export class CreateDependentsComponent implements OnInit {
  form!: FormGroup;
  associates: Associate[] = [];
  associateFilterCtrl = new FormControl<string | Associate>('', [Validators.required, this.requireMatch]);
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
      // O campo associadoId será setado manualmente, não precisa estar no form group principal
      situacao: ['Regular', Validators.required],
      grauParentesco: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: [''],
      numeroCarteirinha: ['', [Validators.pattern(/^[0-9]*$/)]],
      categoria: [''],
      validadeCarteirinha: [''],
      sexo: ['', Validators.required],
      cpf: ['', [CustomValidators.cpfValidator()]], // Opcional, mas se preenchido, deve ser válido
      rg: ['', [Validators.pattern(/^[0-9]*$/)]], // Opcional, mas apenas números
      dataNascimento: ['', [Validators.required, CustomValidators.minAgeValidator(1)]],
      localNascimento: [''],
      nacionalidade: [''],
      estadoCivil: [''],
      grauInstrucao: [''],
      profissao: [''],
      exames: [''],
      atividadesProibidas: [''],
    });

    this.loadAssociates();
  }

  // Validador customizado para o autocomplete
  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (typeof selection === 'string' && selection !== '') {
      return { incorrect: true };
    }
    return null;
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

  efetuarCadastro(): void {
    if (this.form.invalid || this.associateFilterCtrl.invalid) {
      this.snackBar.open('Por favor, verifique os campos com erro.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      this.associateFilterCtrl.markAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const selectedAssociate = this.associateFilterCtrl.value as Associate;

    const payload: Partial<Dependent> = {
      ...formValue,
      associadoId: selectedAssociate.id, // Pega o ID do associado selecionado
      validadeCarteirinha: formValue.validadeCarteirinha ? formValue.validadeCarteirinha : null,
    };

    this.dependentService.createDependent(payload).subscribe({
      next: () => {
        this.snackBar.open('Dependente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-dependents']);
      },
      error: (err) => {
        this.snackBar.open('Ocorreu um erro ao cadastrar o dependente. Verifique os dados.', 'Fechar', { duration: 3000 });
      }
    });
  }
}