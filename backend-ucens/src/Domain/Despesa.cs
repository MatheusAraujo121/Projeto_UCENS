using System;
using System.ComponentModel.DataAnnotations; 
namespace Domain
{
    public class Despesa
    {
        public int Id { get; set; }

        [StringLength(150)] 
        public string Descricao { get; set; } = string.Empty;

        [StringLength(50)] 
        public string Categoria { get; set; } = string.Empty;

        [StringLength(30)] 
        public string Status { get; set; } = "Pendente"; 
        
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }

        [StringLength(50)] 
        public string? FormaPagamento { get; set; }

        [StringLength(50)] 
        public string? NumeroFatura { get; set; }
        
        public decimal? MultaJuros { get; set; }

        [StringLength(500)] 
        public string? Observacoes { get; set; }

        [StringLength(2048)] 
        public string? AnexoUrl { get; set; }
        
        public int FornecedorId { get; set; }
        public Fornecedor Fornecedor { get; set; } = null!;
    }
}