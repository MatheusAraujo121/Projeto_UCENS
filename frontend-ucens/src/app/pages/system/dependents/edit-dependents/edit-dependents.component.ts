import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

// Serviços e Interfaces
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Dependent } from 'src/app/services/dependents/dependent.interface';

// Validador Customizado
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-edit-dependents',
  templateUrl: './edit-dependents.component.html',
  styleUrls: ['./edit-dependents.component.scss']
})
export class EditDependentsComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isLoading = true;
  associates: Associate[] = [];
  associateFilterCtrl = new FormControl<string | Associate>('', [Validators.required, this.requireMatch]);
  filteredAssociates!: Observable<Associate[]>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dependentService: DependentService,
    private associateService: AssociateService,
    private snackBar: MatSnackBar
  ) {
    // Inicializa o formulário com a estrutura correta e as validações
    this.form = this.fb.group({
      situacao: ['', Validators.required],
      grauParentesco: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: [''],
      numeroCarteirinha: ['', [Validators.pattern(/^[0-9]*$/)]],
      categoria: [''],
      validadeCarteirinha: [''],
      sexo: ['', Validators.required],
      cpf: ['', [CustomValidators.cpfValidator()]],
      rg: ['', [Validators.pattern(/^[0-9]*$/)]],
      dataNascimento: ['', [Validators.required, CustomValidators.minAgeValidator(1)]],
      localNascimento: [''],
      nacionalidade: [''],
      estadoCivil: [''],
      grauInstrucao: [''],
      profissao: [''],
      exames: [''],
      atividadesProibidas: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.snackBar.open('ID do dependente não encontrado!', 'Fechar', { duration: 3000 });
      this.router.navigate(['/list-dependents']);
      return;
    }
    this.id = +idParam;
    this.loadDataAndPopulateForm();
  }

  // Validador para garantir que um objeto foi selecionado no autocomplete
  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (typeof selection === 'string' && selection.trim() !== '') {
      return { incorrect: true };
    }
    return null;
  }

  loadDataAndPopulateForm(): void {
    forkJoin({
      dependent: this.dependentService.getDependentById(this.id),
      associates: this.associateService.getAssociados()
    }).subscribe({
      next: ({ dependent, associates }) => {
        this.associates = associates;
        this.populateForm(dependent);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Não foi possível carregar os dados do dependente.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-dependents']);
      }
    });
  }

  private populateForm(dep: Dependent): void {
    const selectedAssociate = this.associates.find(a => a.id === dep.associadoId);
    
    this.form.patchValue({
      situacao: dep.situacao,
      grauParentesco: dep.grauParentesco,
      nome: dep.nome,
      cognome: dep.cognome,
      numeroCarteirinha: dep.numeroCarteirinha,
      categoria: dep.categoria,
      validadeCarteirinha: this.formatDate(dep.validadeCarteirinha),
      sexo: dep.sexo,
      cpf: dep.cpf,
      rg: dep.rg,
      dataNascimento: new Date(dep.dataNascimento), // Converte para objeto Date
      localNascimento: dep.localNascimento,
      nacionalidade: dep.nacionalidade,
      estadoCivil: dep.estadoCivil,
      grauInstrucao: dep.grauInstrucao,
      profissao: dep.profissao,
      exames: dep.exames,
      atividadesProibidas: dep.atividadesProibidas,
    });

    if (selectedAssociate) {
      this.associateFilterCtrl.setValue(selectedAssociate);
    }

    this.filteredAssociates = this.associateFilterCtrl.valueChanges.pipe(
      startWith(selectedAssociate || ''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nome;
        return name ? this._filterAssociates(name) : this.associates.slice();
      })
    );
  }

  private formatDate(date: any): string {
    if (!date) return '';
    // Formata a data para 'YYYY-MM-DD' para o input type="date"
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private _filterAssociates(name: string): Associate[] {
    const filterValue = name.toLowerCase();
    return this.associates.filter(associate => associate.nome.toLowerCase().includes(filterValue));
  }

  displayAssociateName(associate: Associate): string {
    return associate && associate.nome ? associate.nome : '';
  }

  atualizar(): void {
    if (this.form.invalid || this.associateFilterCtrl.invalid) {
      this.form.markAllAsTouched();
      this.associateFilterCtrl.markAsTouched();
      this.snackBar.open('Por favor, verifique os campos com erro.', 'Fechar', { duration: 3000 });
      return;
    }

    const formValue = this.form.getRawValue();
    const selectedAssociate = this.associateFilterCtrl.value as Associate;

    const payload: Partial<Dependent> = {
      id: this.id,
      ...formValue,
      associadoId: selectedAssociate.id,
      validadeCarteirinha: formValue.validadeCarteirinha ? formValue.validadeCarteirinha : null,
    };

    this.dependentService.updateDependent(this.id, payload).subscribe({
      next: () => {
        this.snackBar.open('Dependente atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-dependents']);
      },
      error: (err) => {
        this.snackBar.open('Ocorreu um erro ao tentar atualizar o dependente.', 'Fechar', { duration: 3000 });
      }
    });
  }
}