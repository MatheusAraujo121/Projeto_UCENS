import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface Turma {
  id: number;
  nome: string;
  professor: string;
  dia: string;
  horario: string;
  alunos: number;
}

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {
  // Colunas exibidas na tabela de turmas
  displayedColumns: string[] = ['id', 'nome', 'professor', 'dia', 'horario', 'alunos'];
  // Fonte de dados mockada para a tabela
  classes = new MatTableDataSource<Turma>([
    { id: 1, nome: 'Turma A', professor: 'Prof. Silva', dia: 'Segunda', horario: '08:00', alunos: 20 },
    { id: 2, nome: 'Turma B', professor: 'Prof. Souza', dia: 'Quarta', horario: '10:00', alunos: 15 },
    { id: 3, nome: 'Turma C', professor: 'Prof. Oliveira', dia: 'Sexta', horario: '14:00', alunos: 25 },
    // outros dados mock se necessário...
  ]);

  // Dados da atividade mockados
  activity = {
    nome: 'Natação Infantil',
    tipo: 'Recreativa',
    codigo: 'ACT123',
    categoria: 'Infantil',
    professor: 'Prof. Ana',
    limiteParticipantes: 30,
    exameMedico: true,
    examePiscina: false,
    local: 'Piscina A',
    dias: 'Seg, Qua, Sex',
    horario: '08:00 - 09:00',
    idadeMin: 5,
    idadeMax: 12,
    detalhes: 'Nesta atividade, as crianças irão aprender técnicas básicas de natação e brincadeiras aquáticas.'
  };

  constructor() { }

  ngOnInit(): void {
    // No exemplo funcional, não há lógica adicional no OnInit
  }
}
