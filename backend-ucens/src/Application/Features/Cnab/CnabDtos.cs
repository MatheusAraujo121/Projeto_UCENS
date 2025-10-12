using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Features.Cnab
{
    public class CnabHeaderDto
    {
        public string CodigoDoBeneficiario { get; set; } = string.Empty;
        public DateTime DataDeGeracao { get; set; }
    }

    public class CnabDetailDto
    {
        public int LineNumber { get; set; }
        public string NossoNumero { get; set; } = string.Empty;
        public string NumeroDocumento { get; set; } = string.Empty;
        public string CodigoOcorrencia { get; set; } = string.Empty;
        public string DescricaoOcorrencia { get; set; } = string.Empty;
        public DateTime DataOcorrencia { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorTitulo { get; set; }
        public decimal ValorPago { get; set; }
        public decimal ValorJuros { get; set; }
        public string MotivoOcorrencia { get; set; } = string.Empty;

        public string GetUniqueKey() => $"{NossoNumero}-{DataOcorrencia:yyyyMMdd}-{ValorPago:F2}";
    }

    public class CnabTrailerDto
    {
        public int TotalRegistros { get; set; }
    }

    public class CnabParseResultDto
    {
        public CnabHeaderDto? Header { get; set; }
        public List<CnabDetailDto> Details { get; } = new List<CnabDetailDto>();
        public CnabTrailerDto? Trailer { get; set; }
        public List<string> Errors { get; } = new List<string>();
        public bool HasErrors => Errors.Any();
    }
}