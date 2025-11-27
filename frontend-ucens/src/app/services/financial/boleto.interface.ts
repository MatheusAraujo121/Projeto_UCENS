

export interface Boleto {
  id: number;
  associadoId: number; 
  valor: number;
  vencimento: Date; 
  status: string;
  dataEmissao: Date;
  nossoNumero: string;
  motivoCancelamento?: string;
  dataPagamento?: Date;
  valorPago?: number;
  associado: {
    nome: string;
  };
}