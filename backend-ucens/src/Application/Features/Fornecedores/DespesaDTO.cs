using System;

namespace Application.Features.Fornecedores
{
    public class DespesaDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string? FormaPagamento { get; set; }
        public string? NumeroFatura { get; set; }
        public decimal? MultaJuros { get; set; }
        public string? Observacoes { get; set; }
        public string? AnexoUrl { get; set; }
        public int FornecedorId { get; set; }
    }
}