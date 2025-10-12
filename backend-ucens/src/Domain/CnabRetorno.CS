using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class CnabRetorno
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string ChaveUnica { get; set; } = string.Empty;

        [MaxLength(50)]
        public string NossoNumero { get; set; } = string.Empty;

        [MaxLength(50)]
        public string NumeroDocumento { get; set; } = string.Empty;
        
        public DateTime DataOcorrencia { get; set; }
        
        public DateTime DataVencimento { get; set; }
        
        public decimal ValorTitulo { get; set; }
        
        public decimal ValorPago { get; set; }

        [MaxLength(10)]
        public string CodigoOcorrencia { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string DescricaoOcorrencia { get; set; } = string.Empty;
    }
}