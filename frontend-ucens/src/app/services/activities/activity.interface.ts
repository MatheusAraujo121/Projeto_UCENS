export interface Atividade {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  imagemUrl?: string;
  exigePiscina: boolean;
  exigeFisico: boolean;
  categoria?: string;
  diasDisponiveis: string[];
  horarioSugerido?: string;
  idadeMinima?: number;
  idadeMaxima?: number;
  limiteParticipantes?: number;
  local: string[];
  professorResponsavel?: string;
  acontecimentos?: string;
}