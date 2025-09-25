export interface Evento {
  id: number;
  nome: string;
  descricao?: string;
  local: string;
  inicio: Date;
  fim: Date;
  imagemUrl?: string;
}