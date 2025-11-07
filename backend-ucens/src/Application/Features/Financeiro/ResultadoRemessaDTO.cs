using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Financeiro
{
    public class BoletoGeradoDto
    {
        public int AssociadoId { get; set; }

        [StringLength(150)] // Adicionado
        public string NomeAssociado { get; set; } = "";

        [StringLength(50)] // Adicionado
        public string NossoNumero { get; set; } = "";

        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }

        [StringLength(100)] // Adicionado
        public string LinhaDigitavel { get; set; } = "";

        [StringLength(100)] // Adicionado
        public string CodigoDeBarras { get; set; } = "";
    }

    public class ResultadoRemessaDto
    {
        [StringLength(255)] // Adicionado
        public string NomeArquivo { get; set; } = "";

        [StringLength(500)] // Adicionado
        public string Mensagem { get; set; } = "";

        public List<BoletoGeradoDto> BoletosGerados { get; set; } = new List<BoletoGeradoDto>();
    }
}