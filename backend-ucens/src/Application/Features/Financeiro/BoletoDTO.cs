using System;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Financeiro
{
    public class BoletoDTO
    {
        public int Id { get; set; }
        public int AssociadoId { get; set; }
        public AssociadoBoletoDto? Associado { get; set; }
        public decimal Valor { get; set; }
        public DateTime Vencimento { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime? DataPagamento { get; set; }
        public decimal? ValorPago { get; set; }

        [StringLength(50)] // Adicionado
        public string NossoNumero { get; set; } = "";

        [StringLength(255)] // Adicionado
        public string? MotivoCancelamento { get; set; }

        public string Status { get; set; } = string.Empty;
    }

    public class AssociadoBoletoDto
    {
        [StringLength(150)] // Adicionado
        public string Nome { get; set; } = string.Empty;
    }
}