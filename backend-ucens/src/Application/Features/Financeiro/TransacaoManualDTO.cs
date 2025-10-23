using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Features.Financeiro
{
    public class TransacaoManualDTO
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        [Required]
        public DateTime Data { get; set; }

        [Required]
        public string Tipo { get; set; } = string.Empty; // "Entrada" ou "Saida"

        [StringLength(50)]
        public string? Categoria { get; set; }
    }
}