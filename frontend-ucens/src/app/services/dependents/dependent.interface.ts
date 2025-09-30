export interface Dependent {
  id: number;
  nome: string;
  rg?: string;
  dataNascimento: string;
  sexo?: string;
  nomePai?: string;
  nomeMae?: string;
  situacao?: string;
  grauParentesco?: string;
  dataLimite?: string;
  cognome?: string;
  numeroCarteirinha?: string;
  categoria?: string;
  validadeCarteirinha?: string;
  cpf?: string;
  localNascimento?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  grauInstrucao?: string;
  profissao?: string;
  exames?: string;
  atividadesProibidas?: string;
  associadoId: number;
}

