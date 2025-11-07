using System;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Fornecedores
{
    public class DespesaDTO
    {
        public int Id { get; set; }

        [StringLength(150)] // Adicionado
        public string Descricao { get; set; } = string.Empty;

        [StringLength(50)] // Adicionado
        public string Categoria { get; set; } = string.Empty;

        [StringLength(30)] // Adicionado
        public string Status { get; set; } = string.Empty;

        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }

        [StringLength(50)] // Adicionado
        public string? FormaPagamento { get; set; }

        [StringLength(50)] // Adicionado
        public string? NumeroFatura { get; set; }

        public decimal? MultaJuros { get; set; }

        [StringLength(500)] // Adicionado
        public string? Observacoes { get; set; }

        [StringLength(2048)] // Adicionado
        public string? AnexoUrl { get; set; }

        public int FornecedorId { get; set; }
    }
}