using System;
using System.Collections.Generic;

namespace Application.Features.Financeiro
{
    public class BoletoGeradoDto
    {
        public int AssociadoId { get; set; }
        public string NomeAssociado { get; set; } = "";
        public string NossoNumero { get; set; } = "";
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public string LinhaDigitavel { get; set; } = "";
        public string CodigoDeBarras { get; set; } = "";
    }

    public class ResultadoRemessaDto
    {
        public string NomeArquivo { get; set; } = "";
        public string Mensagem { get; set; } = "";
        public List<BoletoGeradoDto> BoletosGerados { get; set; } = new List<BoletoGeradoDto>();
    }
}