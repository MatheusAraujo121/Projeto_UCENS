import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Carteirinha {
  nome: string;
  cognome: string;
  numero: string;
  categoria: string;
  validade: string;
}

interface Dependent {
  id: number;
  idAssociado: number;
  situacao: 'Regular' | 'Inadimplente' | 'Desligado';
  grauParentesco: string;
  dataLimite: string;
  carteirinha: Carteirinha;
  sexo: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  localNascimento: string;
  nacionalidade: string;
  estadoCivil: string;
  grauInstrucao: string;
  profissao: string;
  exames: string;
  atividadesProibidas: string;
}

@Component({
  selector: 'app-edit-dependents',
  templateUrl: './edit-dependents.component.html',
  styleUrls: ['./edit-dependents.component.scss']
})
export class EditDependentsComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  dependents: Dependent[] = [
    {
      id: 1,
      idAssociado: 1,
      situacao: 'Regular',
      grauParentesco: 'Filho',
      dataLimite: '2025-12-31',
      carteirinha: { nome: 'Lucas Tanaka', cognome: 'Tanaka', numero: '000123', categoria: 'Dependente', validade: '2025-12-31' },
      sexo: 'Masculino',
      cpf: '123.456.789-10',
      rg: '11.111.111-1',
      dataNascimento: '2010-05-20',
      localNascimento: 'Sorocaba, SP',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteiro',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Hemograma anual',
      atividadesProibidas: 'Natação em piscina comum'
    },
    {
      id: 2,
      idAssociado: 3,
      situacao: 'Regular',
      grauParentesco: 'Filha',
      dataLimite: '2025-12-31',
      carteirinha: {
        nome: 'Marina Sato',
        cognome: 'Takahashi',
        numero: '000125',
        categoria: 'Dependente',
        validade: '2025-12-31'
      },
      sexo: 'Feminino',
      cpf: '111.222.333-44',
      rg: '33.333.333-3',
      dataNascimento: '2012-04-03',
      localNascimento: 'São Paulo, SP',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteira',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Oftalmológico anual',
      atividadesProibidas: 'Esportes com bola'
    },
    {
      id: 3,
      idAssociado: 4,
      situacao: 'Desligado',
      grauParentesco: 'Filho',
      dataLimite: '2023-12-31',
      carteirinha: {
        nome: 'Pedro Souza',
        cognome: 'Souza',
        numero: '000126',
        categoria: 'Dependente',
        validade: '2023-12-31'
      },
      sexo: 'Masculino',
      cpf: '222.333.444-55',
      rg: '44.444.444-4',
      dataNascimento: '2009-10-28',
      localNascimento: 'Niterói, RJ',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteiro',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Consulta psicológica',
      atividadesProibidas: 'Academia'
    },
    {
      id: 4,
      idAssociado: 5,
      situacao: 'Regular',
      grauParentesco: 'Filha',
      dataLimite: '2025-12-31',
      carteirinha: {
        nome: 'Carolina Lima',
        cognome: 'Lima',
        numero: '000127',
        categoria: 'Dependente',
        validade: '2025-12-31'
      },
      sexo: 'Feminino',
      cpf: '555.666.777-88',
      rg: '55.555.555-5',
      dataNascimento: '2013-03-11',
      localNascimento: 'Campinas, SP',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteira',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Cardiológico anual',
      atividadesProibidas: 'Corrida de longa distância'
    },
    {
      id: 5,
      idAssociado: 6,
      situacao: 'Inadimplente',
      grauParentesco: 'Filho',
      dataLimite: '2025-12-31',
      carteirinha: {
        nome: 'Matheus Matsuda',
        cognome: 'Matsuda',
        numero: '000128',
        categoria: 'Dependente',
        validade: '2025-12-31'
      },
      sexo: 'Masculino',
      cpf: '999.888.777-66',
      rg: '66.666.666-6',
      dataNascimento: '2011-12-05',
      localNascimento: 'Curitiba, PR',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteiro',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Consulta fonoaudiológica',
      atividadesProibidas: 'Esportes aquáticos'
    },
    {
      id: 6,
      idAssociado: 1,
      situacao: 'Regular',
      grauParentesco: 'Filho',
      dataLimite: '2025-12-31',
      carteirinha: { nome: 'Lucas Tanaka', cognome: 'Tanaka', numero: '000123', categoria: 'Dependente', validade: '2025-12-31' },
      sexo: 'Masculino',
      cpf: '123.456.789-10',
      rg: '11.111.111-1',
      dataNascimento: '2010-05-20',
      localNascimento: 'Sorocaba, SP',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteiro',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Hemograma anual',
      atividadesProibidas: 'Natação em piscina comum'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const dep = this.dependents.find(d => d.id === this.id)!;
    this.buildForm(dep);
  }

  private buildForm(dep: Dependent): void {
    this.form = this.fb.group({
      idAssociado: [dep.idAssociado, Validators.required],
      situacao: [dep.situacao, Validators.required],
      grauParentesco: [dep.grauParentesco, Validators.required],
      dataLimite: [dep.dataLimite, Validators.required],
      carteirinha: this.fb.group({
        nome: [dep.carteirinha.nome, Validators.required],
        cognome: [dep.carteirinha.cognome, Validators.required],
        numero: [dep.carteirinha.numero, Validators.required],
        categoria: [dep.carteirinha.categoria, Validators.required],
        validade: [dep.carteirinha.validade, Validators.required]
      }),
      sexo: [dep.sexo, Validators.required],
      cpf: [dep.cpf, [Validators.required, Validators.minLength(14)]],
      rg: [dep.rg, [Validators.required, Validators.minLength(12)]],
      dataNascimento: [dep.dataNascimento, Validators.required],
      localNascimento: [dep.localNascimento, Validators.required],
      nacionalidade: [dep.nacionalidade, Validators.required],
      estadoCivil: [dep.estadoCivil, Validators.required],
      grauInstrucao: [dep.grauInstrucao, Validators.required],
      profissao: [dep.profissao, Validators.required],
      exames: [dep.exames],
      atividadesProibidas: [dep.atividadesProibidas]
    });
  }

  atualizar(): void {
    if (this.form.valid) {
      console.log('Dependente atualizado:', this.form.value);
      this.router.navigate(['/view-dependents', this.id]);
    } else {
      this.form.markAllAsTouched();
    }
  }
}