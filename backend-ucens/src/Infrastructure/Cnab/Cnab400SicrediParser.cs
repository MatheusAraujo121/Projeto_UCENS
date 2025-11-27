using Application.Common.Interfaces;
using Application.Features.Cnab;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Cnab
{
    public class Cnab400SicrediParser : ICnab400SicrediParser
    {
        private readonly ILogger<Cnab400SicrediParser> _logger;
        private static readonly CultureInfo PtBrCulture = new CultureInfo("pt-BR");

        public Cnab400SicrediParser(ILogger<Cnab400SicrediParser> logger)
        {
            _logger = logger;
        }

        public async Task<CnabParseResultDto> ParseAsync(Stream stream, bool abortOnError = false)
        {
            var resultDto = new CnabParseResultDto();
            var lines = new List<string>();

            using (var reader = new StreamReader(stream))
            {
                string? line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    lines.Add(line);
                }
            }
            
            CnabHeader? header = null;
            var details = new List<CnabDetail>();
            CnabTrailer? trailer = null;

            for (int i = 0; i < lines.Count; i++)
            {
                var line = lines[i];
                var lineNumber = i + 1;

                if (string.IsNullOrWhiteSpace(line) || line.Length < 400)
                {
                    var errorMessage = $"Linha {lineNumber}: A linha é inválida ou menor que 400 caracteres.";
                    resultDto.Errors.Add(errorMessage);
                    _logger.LogWarning(errorMessage);
                    if (abortOnError) continue;
                    else throw new InvalidDataException(errorMessage);
                }

                try
                {
                    switch (line[0])
                    {
                        case '0':
                            header = ParseHeader(line, lineNumber);
                            break;
                        case '1':
                            details.Add(ParseDetail(line, lineNumber));
                            break;
                        case '9':
                            trailer = ParseTrailer(line, lineNumber);
                            break;
                        default:
                            var errorMessage = $"Linha {lineNumber}: Tipo de registro desconhecido '{line[0]}'.";
                            resultDto.Errors.Add(errorMessage);
                            _logger.LogWarning(errorMessage);
                            if (abortOnError) continue;
                            else throw new InvalidDataException(errorMessage);
                    }
                }
                catch (Exception ex)
                {
                    var errorMessage = $"Linha {lineNumber}: Erro ao processar. Detalhes: {ex.Message}";
                    resultDto.Errors.Add(errorMessage);
                    _logger.LogError(ex, errorMessage);
                    if (!abortOnError) throw;
                }
            }

            if (header != null)
            {
                resultDto.Header = new CnabHeaderDto
                {
                    CodigoDoBeneficiario = header.CodigoDoBeneficiario,
                    DataDeGeracao = header.DataDeGeracao
                };
            }

            resultDto.Details.AddRange(details.Select(d => new CnabDetailDto
            {
                LineNumber = d.LineNumber,
                NossoNumero = d.NossoNumero,
                NumeroDocumento = d.NumeroDocumento,
                CodigoOcorrencia = d.CodigoOcorrencia,
                DescricaoOcorrencia = d.DescricaoOcorrencia,
                DataOcorrencia = d.DataOcorrencia,
                DataVencimento = d.DataVencimento,
                ValorTitulo = d.ValorTitulo,
                ValorPago = d.ValorPago,
                ValorJuros = d.ValorJuros,
                MotivoOcorrencia = d.MotivoOcorrencia
            }));

            if (trailer != null)
            {
                 resultDto.Trailer = new CnabTrailerDto { TotalRegistros = lines.Count };
            }

            return resultDto;
        }

        #region Private Parsers
        private CnabHeader ParseHeader(string line, int lineNumber)
        {
            return new CnabHeader
            {
                LineNumber = lineNumber,
                RawLine = line,
                CodigoDoBeneficiario = line.Substring(26, 5).Trim(),
                DataDeGeracao = ParseDate(line.Substring(94, 8), "yyyyMMdd")
            };
        }

        private CnabDetail ParseDetail(string line, int lineNumber)
        {
            return new CnabDetail
            {
                LineNumber = lineNumber,
                RawLine = line,
                NossoNumero = line.Substring(47, 9).Trim(),
                NumeroDocumento = line.Substring(116, 10).Trim(),
                CodigoOcorrencia = line.Substring(108, 2),
                DescricaoOcorrencia = GetDescricaoOcorrencia(line.Substring(108, 2)),
                DataOcorrencia = ParseDate(line.Substring(110, 6), "ddMMyy"),
                DataVencimento = ParseDate(line.Substring(146, 6), "ddMMyy"),
                ValorTitulo = ParseDecimal(line.Substring(152, 13)),
                ValorPago = ParseDecimal(line.Substring(253, 13)),
                ValorJuros = ParseDecimal(line.Substring(266, 13)),
                MotivoOcorrencia = line.Substring(318, 10).Trim()
            };
        }

        private CnabTrailer ParseTrailer(string line, int lineNumber)
        {
            return new CnabTrailer { LineNumber = lineNumber, RawLine = line };
        }

        private DateTime ParseDate(string dateStr, string format)
        {
            if (DateTime.TryParseExact(dateStr, format, PtBrCulture, DateTimeStyles.None, out var date)) return date;
            _logger.LogWarning($"Não foi possível converter a data '{dateStr}' com o formato '{format}'.");
            return DateTime.MinValue;
        }

        private decimal ParseDecimal(string decimalStr)
        {
            if (decimal.TryParse(decimalStr, out var value)) return value / 100;
            _logger.LogWarning($"Não foi possível converter o valor '{decimalStr}' para decimal.");
            return 0;
        }
        
        private string GetDescricaoOcorrencia(string codigo)
        {
            return codigo switch {
                "02" => "Entrada confirmada", "03" => "Entrada rejeitada", "06" => "Liquidação normal",
                "09" => "Baixado automaticamente via arquivo", "10" => "Baixado conforme instruções da cooperativa",
                _ => "Código não identificado"
            };
        }
        #endregion

        #region Modelos Internos
        private abstract class CnabRecord { public int LineNumber { get; set; } public string RawLine { get; set; } = ""; }
        private class CnabHeader : CnabRecord { public string CodigoDoBeneficiario { get; set; } = ""; public DateTime DataDeGeracao { get; set; } }
        private class CnabDetail : CnabRecord { public string NossoNumero { get; set; } = ""; public string NumeroDocumento { get; set; } = ""; public string CodigoOcorrencia { get; set; } = ""; public string DescricaoOcorrencia { get; set; } = ""; public DateTime DataOcorrencia { get; set; } public DateTime DataVencimento { get; set; } public decimal ValorTitulo { get; set; } public decimal ValorPago { get; set; } public decimal ValorJuros { get; set; } public string MotivoOcorrencia { get; set; } = ""; }
        private class CnabTrailer : CnabRecord { public int TotalRegistros { get; set; } }
        #endregion
    }
}