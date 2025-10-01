using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain;
using System.Globalization; // Necessário para formatação de valores
using BoletoEntidade = Domain.Boleto;

namespace Application.Features.Financeiro
{
    public class ResultadoRemessa
    {
        public string ConteudoArquivo { get; set; } = "";
        public string NomeArquivo { get; set; } = "";
    }

    public class FinanceiroService
    {
        private readonly IAssociadoRepository _associadoRepo;
        private readonly IBoletoRepository _boletoRepo;

        public FinanceiroService(IAssociadoRepository associadoRepo, IBoletoRepository boletoRepo)
        {
            _associadoRepo = associadoRepo;
            _boletoRepo = boletoRepo;
        }

        public async Task<ResultadoRemessa> GerarArquivoRemessa(int[] associadoIds, decimal valor, DateTime dataVencimento)
        {
            var associados = await _associadoRepo.GetAssociadosByIds(associadoIds);
            var boletos = new List<BoletoEntidade>();

            // Usando os dados do seu arquivo de exemplo
            var cedente = new
            {
                Codigo = "57118",
                CPFCNPJ = "48388334000100",
                Agencia = "0718",
                Posto = "05"
            };

            var sb = new StringBuilder();
            var dataGeracao = DateTime.Now;

            // --- HEADER IDÊNTICO AO EXEMPLO ---
            sb.Append("01REMESSA01COBRANCA       "); // 0-26
            sb.Append(cedente.Codigo); // 27-31
            sb.Append(cedente.CPFCNPJ); // 32-45
            sb.Append("".PadRight(31)); // 46-76 (Filler, sem nome do cedente)
            sb.Append("748SICREDI       "); // 77-94
            sb.Append(dataGeracao.ToString("yyyyMMdd")); // 95-102
            sb.Append("".PadRight(8)); // 103-110
            sb.Append("1".PadLeft(7, '0')); // 111-117 (Número da remessa)
            sb.Append("".PadRight(273)); // 118-390
            sb.Append("2.00"); // 391-394
            sb.Append("1".PadLeft(6, '0')); // 395-400
            sb.AppendLine();

            int sequencialRegistro = 2;
            foreach (var associado in associados)
            {
                var sequencialNossoNumero = sequencialRegistro - 1;
                var nossoNumeroCompleto = GerarNossoNumero(cedente.Agencia, cedente.Posto, cedente.Codigo, sequencialNossoNumero);

                var boleto = new BoletoEntidade
                {
                    AssociadoId = associado.Id,
                    Valor = valor,
                    DataVencimento = dataVencimento,
                    DataEmissao = dataGeracao,
                    NossoNumero = nossoNumeroCompleto,
                    Status = Domain.BoletoStatus.Gerado,
                    JurosMora = 0.20M, // Valor por dia
                    PercentualMulta = 2.00M
                };
                boletos.Add(boleto);

                // --- REGISTRO DETALHE (TIPO 1) IDÊNTICO AO EXEMPLO ---
                sb.Append("1"); // 1
                sb.Append("AAA            AAA                            "); // 2-47
                sb.Append(boleto.NossoNumero); // 48-56
                sb.Append("      "); // 57-62
                sb.Append(boleto.DataEmissao.ToString("ddMMyy")); // 63-68
                sb.Append(" N B  00    "); // 69-82
                sb.Append("0".PadLeft(13, '0')); // 83-95 (Valor por dia de antecipação)
                sb.Append("".PadLeft(4, '0')); // 96-99 (Multa)
                sb.Append("".PadRight(9)); // 100-108
                sb.Append("01"); // 109-110 (Instrução)
                sb.Append(boleto.Id.ToString().PadRight(10)); // 111-120 (Seu Número)
                sb.Append(boleto.DataVencimento.ToString("ddMMyy")); // 121-126
                sb.Append(boleto.Valor.ToString("F2", CultureInfo.InvariantCulture).Replace(".", "").PadLeft(13, '0')); // 127-139
                sb.Append("".PadRight(3)); // 140-142
                sb.Append("".PadLeft(5,'0')); // 143-147
                sb.Append(" J"); // 148-149 (Espécie)
                sb.Append("N"); // 150 (Aceite)
                sb.Append(boleto.DataEmissao.ToString("ddMMyy")); // 151-156
                sb.Append("0000"); // 157-160 (Instrução protesto)
                var jurosFormatado = boleto.JurosMora.HasValue ? boleto.JurosMora.Value.ToString("F2", CultureInfo.InvariantCulture).Replace(".", "").PadLeft(13, '0') : "".PadLeft(13, '0');
                sb.Append(jurosFormatado); // 161-173 (Juros)
                sb.Append("000000"); // 174-179
                sb.Append("".PadLeft(13, '0')); // 180-192 (Desconto)
                sb.Append("0000"); // 193-196
                sb.Append("".PadLeft(9, '0')); // 197-205
                sb.Append("".PadLeft(13, '0')); // 206-218 (Abatimento)
                sb.Append(associado.CPF.Length == 11 ? "1" : "2"); // 219
                sb.Append("".PadLeft(1, '0')); // 220
                sb.Append(associado.CPF.Replace(".", "").Replace("-", "").Replace("/", "").PadLeft(14, '0')); // 221-234
                sb.Append(associado.Nome.PadRight(40)); // 235-274
                sb.Append(associado.Endereco.PadRight(40)); // 275-314
                sb.Append("".PadLeft(11, '0')); // 315-325
                sb.Append(" "); // 326
                sb.Append((associado.Numero + "00000000").Substring(0,8)); // 327-334 (CEP, apenas números)
                sb.Append("".PadLeft(5,'0')); // 335-339
                sb.Append("".PadRight(55)); // 340-394
                sb.Append(sequencialRegistro.ToString().PadLeft(6, '0')); // 395-400
                sb.AppendLine();

                sequencialRegistro++;

                // --- REGISTRO MENSAGEM (TIPO 2) IDÊNTICO AO EXEMPLO ---
                sb.Append("2           "); // 1-12
                sb.Append(boleto.NossoNumero); // 13-21
                sb.Append("Dependente      Descricao      Ref.       Data Venc       Valor".PadRight(80)); // 22-101
                sb.Append("                                 01.01-MENSALID 10/2024    10/06/2025      90,00".PadRight(80)); // 102-181
                sb.Append("".PadRight(161)); // 182-342
                sb.Append("".PadRight(52)); // 343-394
                sb.Append(sequencialRegistro.ToString().PadLeft(6, '0')); // 395-400
                sb.AppendLine();

                sequencialRegistro++;
            }

            // --- TRAILER IDÊNTICO AO EXEMPLO ---
            sb.Append("91748"); // 1-5
            sb.Append(cedente.Codigo); // 6-10
            sb.Append("".PadRight(384)); // 11-394
            sb.Append(sequencialRegistro.ToString().PadLeft(6, '0')); // 395-400
            sb.AppendLine();

            await _boletoRepo.AddRangeAsync(boletos);
            await _boletoRepo.SaveChangesAsync();

            return new ResultadoRemessa
            {
                ConteudoArquivo = sb.ToString(),
                NomeArquivo = GerarNomeArquivo(cedente.Codigo)
            };
        }

        private string GerarNomeArquivo(string codigoCedente)
        {
            var data = DateTime.Now;
            var mesCodigo = data.Month switch
            {
                10 => "O",
                11 => "N",
                12 => "D",
                _ => data.Month.ToString()
            };
            return $"{codigoCedente}{mesCodigo}{data.Day:D2}.CRM"; // Usando .CRM como no exemplo
        }

        private string GerarNossoNumero(string agencia, string posto, string cedente, int sequencial)
        {
            string ano = DateTime.Now.ToString("yy");
            string byteGeracao = "2";
            string numeroSequencial = sequencial.ToString().PadLeft(5, '0');
            string baseCalculo = $"{agencia}{posto}{cedente}{ano}{byteGeracao}{numeroSequencial}";
            
            int soma = 0;
            int peso = 2;
            for (int i = baseCalculo.Length - 1; i >= 0; i--)
            {
                soma += Convert.ToInt32(baseCalculo[i].ToString()) * peso;
                peso = (peso == 9) ? 2 : peso + 1;
            }

            int resto = soma % 11;
            int dv = 11 - resto;
            if (dv >= 10) dv = 0;

            return $"{ano}{byteGeracao}{numeroSequencial}{dv}";
        }
    }
}