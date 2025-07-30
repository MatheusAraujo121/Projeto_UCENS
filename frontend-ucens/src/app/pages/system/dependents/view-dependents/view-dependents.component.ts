import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-view-dependents',
  templateUrl: './view-dependents.component.html',
  styleUrls: ['./view-dependents.component.scss']
})
export class ViewDependentsComponent implements OnInit {
  dependentIndex = 0;
  dependents: Dependent[] = [
    {
      id: 1,
      idAssociado: 2,
      situacao: 'Regular',
      grauParentesco: 'Filho',
      dataLimite: '2025-12-31',
      carteirinha: {
        nome: 'Lucas Tanaka',
        cognome: 'Tanaka',
        numero: '000124',
        categoria: 'Dependente',
        validade: '2025-12-31'
      },
      sexo: 'Masculino',
      cpf: '321.654.987-00',
      rg: '22.222.222-2',
      dataNascimento: '2011-08-15',
      localNascimento: 'Sorocaba, SP',
      nacionalidade: 'Brasileira',
      estadoCivil: 'Solteiro',
      grauInstrucao: 'Ensino Fundamental',
      profissao: 'Estudante',
      exames: 'Alergia alimentar anual',
      atividadesProibidas: 'Atividades em altura'
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
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  }

  get dependent(): Dependent {
    return this.dependents[this.dependentIndex];
  }

  anterior() { if (this.dependentIndex > 0) this.dependentIndex--; }
  proximo() { if (this.dependentIndex < this.dependents.length - 1) this.dependentIndex++; }

  voltarLista(): void {
    this.router.navigate(['/list-dependents']);
  }
}