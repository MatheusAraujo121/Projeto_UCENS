import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Serviços e Interfaces
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Dependent } from 'src/app/services/dependents/dependent.interface';

@Component({
  selector: 'app-edit-dependents',
  templateUrl: './edit-dependents.component.html',
  styleUrls: ['./edit-dependents.component.scss']
})
export class EditDependentsComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isLoading = true;

  // Propriedades para o autocomplete de associados
  associates: Associate[] = [];
  associateFilterCtrl = new FormControl<string | Associate>('');
  filteredAssociates!: Observable<Associate[]>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dependentService: DependentService,
    private associateService: AssociateService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      alert('ID do dependente não encontrado!');
      this.router.navigate(['/list-dependents']);
      return;
    }
    this.id = +idParam;
    this.loadDataAndBuildForm();
  }

  /**
   * Carrega os dados do dependente e a lista de associados para preencher o formulário.
   */
  loadDataAndBuildForm(): void {
    forkJoin({
      dependent: this.dependentService.getDependentById(this.id),
      associates: this.associateService.getAssociados()
    }).subscribe({
      next: ({ dependent, associates }) => {
        this.associates = associates;
        this.buildForm(dependent);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados para edição:', err);
        alert('Não foi possível carregar os dados do dependente.');
        this.router.navigate(['/list-dependents']);
      }
    });
  }

  /**
   * Constrói o formulário reativo e o preenche com os dados do dependente.
   */
  private buildForm(dep: Dependent): void {
    const selectedAssociate = this.associates.find(a => a.id === dep.associadoId);

    this.form = this.fb.group({
      associadoId: [selectedAssociate, Validators.required],
      situacao: [dep.situacao, Validators.required],
      grauParentesco: [dep.grauParentesco, Validators.required],
      exames: [dep.exames],
      atividadesProibidas: [dep.atividadesProibidas],
      carteirinha: this.fb.group({
        nome: [dep.nome, Validators.required],
        cognome: [dep.cognome, Validators.required],
        numero: [dep.numeroCarteirinha],
        categoria: [dep.categoria],
        validade: [this.formatDate(dep.validadeCarteirinha)],
      }),
      sexo: [dep.sexo, Validators.required],
      cpf: [dep.cpf, [Validators.minLength(14)]],
      rg: [dep.rg, [Validators.minLength(12)]],
      dataNascimento: [this.formatDate(dep.dataNascimento), Validators.required],
      localNascimento: [dep.localNascimento],
      nacionalidade: [dep.nacionalidade],
      estadoCivil: [dep.estadoCivil],
      grauInstrucao: [dep.grauInstrucao],
      profissao: [dep.profissao],
    });

    this.associateFilterCtrl.setValue(selectedAssociate || '');
    this.filteredAssociates = this.associateFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nome;
        return name ? this._filterAssociates(name) : this.associates.slice();
      })
    );
  }

  /**
   * Formata uma data para o formato YYYY-MM-DD, compatível com input[type=date].
   */
  private formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${d.getFullYear()}-${month}-${day}`;
    } catch (e) {
      return '';
    }
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

  /**
   * Coleta os dados do formulário, monta o payload e envia para a API para atualização.
   */
  atualizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const payload: Partial<Dependent> = {
      id: this.id,
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

    this.dependentService.updateDependent(this.id, payload).subscribe({
      next: () => {
        alert('Dependente atualizado com sucesso!');
        this.router.navigate(['/list-dependents']);
      },
      error: (err) => {
        console.error('Erro ao atualizar dependente:', err);
        alert('Ocorreu um erro ao tentar atualizar o dependente.');
      }
    });
  }
}
