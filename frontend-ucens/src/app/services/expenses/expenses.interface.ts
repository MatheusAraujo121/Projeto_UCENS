// src/app/services/expenses/expenses.interface.ts

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