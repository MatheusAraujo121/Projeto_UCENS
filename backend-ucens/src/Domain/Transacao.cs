using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Transacao
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public DateTime Data { get; set; }

        [Required]
        [StringLength(10)]
        public string Tipo { get; set; } = string.Empty; 

        [StringLength(50)]
        public string? Categoria { get; set; }
    }
}