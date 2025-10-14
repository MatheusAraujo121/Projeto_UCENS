using System;

namespace Domain
{
    public class Boleto
    {
        public int Id { get; set; }
        public int AssociadoId { get; set; }
        public Associado? Associado { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime? DataPagamento { get; set; } // Adicionado
        public decimal? ValorPago { get; set; }      // Adicionado
        public string NossoNumero { get; set; } = "";
        public string? MotivoCancelamento { get; set; }
        public BoletoStatus Status { get; set; }
        public decimal JurosMora { get; set; }
        public decimal PercentualMulta { get; set; }
        public int NumeroArquivoRemessa { get; set; }
        public int SequencialNossoNumero { get; set; }
    }

    public enum BoletoStatus
    {
        Pendente,
        Pago,
        Vencido,
        Cancelado,
        CancelamentoSolicitado // NOVO STATUS ADICIONADO
    }
}