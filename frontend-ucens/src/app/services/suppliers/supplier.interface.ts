export interface Despesa {
  id: number;
  descricao: string;
  categoria: string;
  status: string; 
  valor: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  formaPagamento?: string;
  numeroFatura?: string;
  multaJuros?: number;
  observacoes?: string;
  anexoUrl?: string;
  fornecedorId: number;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  responsavel: string;
  ativo: boolean;
  limiteCredito?: number;
  observacoes?: string;
  despesas: Despesa[];
}