import { Component, OnInit, ViewChild } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'; 


interface Turma {
  id: number;
  nome: string;
  professor: string;
  dia: string;
  horario: string;
  alunos: number;
  capacidade: number;
}

interface Activity {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  imageUrl?: string;
  medicalExamRequired: boolean;
  poolExamRequired: boolean;
  categoria: string; 
  dias: string;
  horario: string;
  idadeMin: number;
  idadeMax: number;
  limite: number; 
  local: string;
  professor: string;
  turmas: Turma[];
}


@Component({
  selector: 'app-view-sporty',
  templateUrl: './view-sporty.component.html',
  styleUrls: ['./view-sporty.component.scss']
})
export class ViewSportyComponent implements OnInit {
  
  activity: Activity | undefined;
  classesDataSource = new MatTableDataSource<Turma>();
  displayedColumns: string[] = ['id', 'nome', 'professor', 'dia', 'horario', 'alunos'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  private allActivities: Activity[] = [
    {
      id: 1,
      codigo: 'NAT-INF',
      nome: 'Natação Infantil',
      descricao: 'Aulas de natação para crianças, focadas em segurança e diversão na água. Aprenda os estilos básicos e perca o medo de nadar em um ambiente seguro e com professores qualificados.',
      imageUrl: 'assets/activities/futebol.jpg', 
      medicalExamRequired: true,
      poolExamRequired: true,
      categoria: 'Esportiva', 
      dias: 'Segundas e Quartas',
      horario: '10:00 - 11:00',
      idadeMin: 5,
      idadeMax: 12,
      limite: 15, 
      local: 'Piscina Aquecida - Sede Campestre II',
      professor: 'Prof. Ana Beatriz',
      turmas: [
        { id: 101, nome: 'Turma Manhã', professor: 'Prof. Ana Beatriz', dia: 'Seg/Qua', horario: '10:00', alunos: 12, capacidade: 15 },
        { id: 102, nome: 'Turma Tarde', professor: 'Prof. Carlos', dia: 'Ter/Qui', horario: '15:00', alunos: 10, capacidade: 15 },
        { id: 103, nome: 'Turma Noite', professor: 'Prof. Maria', dia: 'Seg/Qua', horario: '19:00', alunos: 8, capacidade: 15 },
        { id: 104, nome: 'Turma Sábado', professor: 'Prof. Pedro', dia: 'Sábado', horario: '09:00', alunos: 14, capacidade: 15 },
        { id: 105, nome: 'Turma Especial', professor: 'Prof. Ana Beatriz', dia: 'Ter/Qui', horario: '11:00', alunos: 7, capacidade: 15 },
        { id: 106, nome: 'Turma Jovens', professor: 'Prof. Carlos', dia: 'Sex', horario: '17:00', alunos: 11, capacidade: 15 },
        { id: 107, nome: 'Turma Avançada', professor: 'Prof. Ana Beatriz', dia: 'Seg/Qua', horario: '11:00', alunos: 9, capacidade: 15 },
        { id: 108, nome: 'Turma Iniciante', professor: 'Prof. Maria', dia: 'Ter/Qui', horario: '14:00', alunos: 13, capacidade: 15 },
        { id: 109, nome: 'Turma Fim de Semana', professor: 'Prof. Pedro', dia: 'Dom', horario: '10:00', alunos: 6, capacidade: 15 },
      ]
    },
    {
      id: 2,
      codigo: 'FUT-ADU',
      nome: 'Futebol Adulto',
      descricao: 'Aulas de futebol para adultos, focadas em técnicas e táticas de jogo. Melhore seu condicionamento físico e suas habilidades em campo.',
      imageUrl: 'assets/activities/futebol.jpg',
      medicalExamRequired: true,
      poolExamRequired: false,
      categoria: 'Esportiva',
      dias: 'Terças e Quintas',
      horario: '20:00 - 21:30',
      idadeMin: 18,
      idadeMax: 99,
      limite: 25,
      local: 'Campo de Futebol Principal',
      professor: 'Prof. Roberto',
      turmas: [
        { id: 201, nome: 'Turma Noite A', professor: 'Prof. Roberto', dia: 'Ter/Qui', horario: '20:00', alunos: 20, capacidade: 25 },
        { id: 202, nome: 'Turma Noite B', professor: 'Prof. Fernando', dia: 'Seg/Qua', horario: '21:00', alunos: 18, capacidade: 25 },
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const activityId = +idParam;
      this.activity = this.allActivities.find(act => act.id === activityId);
    }
  }
}