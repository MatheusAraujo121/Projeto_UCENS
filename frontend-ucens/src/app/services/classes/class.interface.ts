export interface AlunoMatriculado {
  id: number;
  nome: string;
  tipo: 'Associado' | 'Dependente';
}

export interface Turma {
  id: number;
  nome: string;
  professor: string;
  diasHorarios: string;
  vagas: number;
  atividadeId: number;
  alunosMatriculados: AlunoMatriculado[];
}

export interface MatriculaDTO {
  turmaId: number;
  alunoId: number;
}