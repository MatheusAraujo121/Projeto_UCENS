export interface Associate {
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
  endereco: string;
  numero: string;
  complemento: string;
  nacionalidade: string;
  grauInstrucao: string;
  profissao: string;
  situacao: 'Regular' | 'Desligado' | 'Inadimplente';
}