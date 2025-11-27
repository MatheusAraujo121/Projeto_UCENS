using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; 

namespace Application.Features.Financeiro
{
    public class BoletoGeradoDto
    {
        public int AssociadoId { get; set; }

        [StringLength(150)] 
        public string NomeAssociado { get; set; } = "";

        [StringLength(50)]
        public string NossoNumero { get; set; } = "";

        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }

        [StringLength(100)] 
        public string LinhaDigitavel { get; set; } = "";

        [StringLength(100)] 
        public string CodigoDeBarras { get; set; } = "";
    }

    public class ResultadoRemessaDto
    {
        [StringLength(255)] 
        public string NomeArquivo { get; set; } = "";

        [StringLength(500)]
        public string Mensagem { get; set; } = "";

        public List<BoletoGeradoDto> BoletosGerados { get; set; } = new List<BoletoGeradoDto>();
    }
}