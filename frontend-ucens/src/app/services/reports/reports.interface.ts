export interface RelatorioAssociado {
  id: number;
  nome: string;
  cpf: string;
  situacao: string;
  dependentes: {
    id: number;
    nome: string;
    dataNascimento: string;
    grauParentesco: string;
  }[];
}

export interface RelatorioFinanceiro {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  transacoes: TransacaoItem[];
}

export interface TransacaoItem {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: 'Entrada' | 'Saida';
  valor: number;
  origem: 'Boleto' | 'Despesa' | 'Manual';
}

export interface TransacaoManual {
    id?: number;
    descricao: string;
    valor: number;
    data: string;
    tipo: 'Entrada' | 'Saida';
    categoria?: string;
}
