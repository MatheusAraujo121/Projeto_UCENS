using System;

namespace Domain
{
    public class Despesa
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Status { get; set; } = "Pendente"; // "Paga", "Pendente", "Atrasada", "Cancelada"
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string? FormaPagamento { get; set; }
        public string? NumeroFatura { get; set; }
        public decimal? MultaJuros { get; set; }
        public string? Observacoes { get; set; }
        public string? AnexoUrl { get; set; }
        public int FornecedorId { get; set; }
        public Fornecedor Fornecedor { get; set; } = null!;
    }
}