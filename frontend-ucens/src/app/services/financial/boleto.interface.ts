// src/app/services/financial/boleto.interface.ts

export interface Boleto {
  id: number;
  associadoId: number; // Corresponde a 'AssociadoId' do C#
  valor: number;
  vencimento: Date; // << CORRIGIDO de 'vencimento' para 'dataVencimento'
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