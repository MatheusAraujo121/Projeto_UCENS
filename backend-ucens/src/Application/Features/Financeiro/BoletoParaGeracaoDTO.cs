using System;

namespace Application.Features.Financeiro
{
    public class BoletoParaGeracaoDto
    {
        public int AssociadoId { get; set; }
        public decimal? Valor { get; set; }
        public DateTime? DataVencimento { get; set; }
        
    }
}