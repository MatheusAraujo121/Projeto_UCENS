import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Associate {
  id: number;
  nome: string;
  cognome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  nomePai: string;
  nomeMae: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  localNascimento: string;
  nacionalidade: string;
  grauInstrucao: string;
  profissao: string;
  situacao: 'Regular' | 'Desligado' | 'Inadimplente';
}

@Component({
  selector: 'app-view-associates',
  templateUrl: './view-associates.component.html',
  styleUrls: ['./view-associates.component.scss']
})

export class ViewAssociatesComponent implements OnInit {

  associadoIndex = 0;
  associados: Associate[] = [
    {
      id: 1,
      nome: 'Andressa Akemi Tanaka',
      cognome: 'Tanaka',
      cpf: '817.476.938-20',
      rg: '24.860.906-3',
      telefone: '(11) 98765-4321',
      email: 'andressa@example.com',
      nomePai: 'Carlos Tanaka',
      nomeMae: 'Marina Akemi',
      dataNascimento: '1995-03-14',
      sexo: 'Feminino',
      estadoCivil: 'Casada',
      localNascimento: 'Sorocaba, SP',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Superior Completo',
      profissao: 'Engenheira',
      situacao: 'Regular'
    },
    {
      id: 2,
      nome: 'Ana Beatriz Takahashi',
      cognome: 'Takahashi',
      cpf: '214.563.982-01',
      rg: '45.210.998-7',
      telefone: '(11) 99888-1234',
      email: 'ana.takahashi@example.com',
      nomePai: 'Eduardo Takahashi',
      nomeMae: 'Keiko Takahashi',
      dataNascimento: '1998-05-12',
      sexo: 'Feminino',
      estadoCivil: 'Solteira',
      localNascimento: 'São Paulo, SP',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Superior Completo',
      profissao: 'Designer Gráfica',
      situacao: 'Regular'
    },
    {
      id: 3,
      nome: 'André Francisco de Souza',
      cognome: 'Souza',
      cpf: '345.908.712-44',
      rg: '33.889.102-2',
      telefone: '(21) 98444-5566',
      email: 'andre.souza@example.com',
      nomePai: 'Francisco de Souza',
      nomeMae: 'Maria Helena de Souza',
      dataNascimento: '1990-09-03',
      sexo: 'Masculino',
      estadoCivil: 'Casado',
      localNascimento: 'Niterói, RJ',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Médio Completo',
      profissao: 'Técnico de Informática',
      situacao: 'Desligado'
    },
    {
      id: 4,
      nome: 'Juliana Matsuda',
      cognome: 'Matsuda',
      cpf: '576.320.987-00',
      rg: '42.321.774-0',
      telefone: '(41) 97777-6655',
      email: 'juliana.matsuda@example.com',
      nomePai: 'Carlos Matsuda',
      nomeMae: 'Luciana Matsuda',
      dataNascimento: '1992-11-08',
      sexo: 'Feminino',
      estadoCivil: 'Solteira',
      localNascimento: 'Curitiba, PR',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Superior Incompleto',
      profissao: 'Recepcionista',
      situacao: 'Inadimplente'
    },
    {
      id: 5,
      nome: 'Felipe Taniguchi',
      cognome: 'Taniguchi',
      cpf: '709.123.456-88',
      rg: '28.456.332-5',
      telefone: '(13) 98866-3321',
      email: 'felipe.taniguchi@example.com',
      nomePai: 'Ricardo Taniguchi',
      nomeMae: 'Angela Taniguchi',
      dataNascimento: '1997-06-30',
      sexo: 'Masculino',
      estadoCivil: 'Solteiro',
      localNascimento: 'Santos, SP',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Técnico Completo',
      profissao: 'Eletricista',
      situacao: 'Regular'
    },
    {
      id: 6,
      nome: 'Larissa Kobayashi',
      cognome: 'Kobayashi',
      cpf: '832.123.789-55',
      rg: '36.920.345-1',
      telefone: '(11) 98765-1122',
      email: 'larissa.kobayashi@example.com',
      nomePai: 'Sérgio Kobayashi',
      nomeMae: 'Renata Kobayashi',
      dataNascimento: '1994-01-27',
      sexo: 'Feminino',
      estadoCivil: 'Casada',
      localNascimento: 'Mogi das Cruzes, SP',
      nacionalidade: 'Brasileira',
      grauInstrucao: 'Ensino Superior Completo',
      profissao: 'Contadora',
      situacao: 'Desligado'
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
  }


  get associado(): Associate {
    return this.associados[this.associadoIndex];
  }

  anterior() { if (this.associadoIndex > 0) this.associadoIndex--; }
  proximo() { if (this.associadoIndex < this.associados.length - 1) this.associadoIndex++; }
}