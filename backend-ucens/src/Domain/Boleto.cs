using System;
using System.ComponentModel.DataAnnotations; 

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
        public DateTime? DataPagamento { get; set; } 
        public decimal? ValorPago { get; set; }       

        [StringLength(50)] 
        public string NossoNumero { get; set; } = "";

        [StringLength(255)] 
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
        CancelamentoSolicitado,
        CancelamentoEnviado 
    }
}