using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain;
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
        private const decimal VALOR_PADRAO_MENSALIDADE = 90.00M; // Defina o valor padrão aqui

        public FinanceiroService(IAssociadoRepository associadoRepo, IBoletoRepository boletoRepo)
        {
            _associadoRepo = associadoRepo;
            _boletoRepo = boletoRepo;
        }

        public async Task<ResultadoRemessa> GerarArquivoRemessa(List<BoletoParaGeracaoDto> boletosParaGerar)
        {
            // Se a lista de boletos estiver vazia, busca todos os associados ativos
            if (boletosParaGerar == null || !boletosParaGerar.Any())
            {
                var todosAssociadosAtivos = await _associadoRepo.GetAssociadosAtivosAsync(); 
                boletosParaGerar = todosAssociadosAtivos.Select(a => new BoletoParaGeracaoDto { AssociadoId = a.Id }).ToList();
            }

            if (!boletosParaGerar.Any())
            {
                return new ResultadoRemessa(); // Retorna vazio se não houver associados para gerar boleto
            }
            
            var associadoIds = boletosParaGerar.Select(b => b.AssociadoId).Distinct().ToArray();
            var associados = await _associadoRepo.GetAssociadosByIds(associadoIds);
            var boletos = new List<BoletoEntidade>();

            var cedente = new
            {
                Codigo = "57118",
                CPFCNPJ = "48388334000100",
                Agencia = "0718",
                Posto = "05"
            };

            var sb = new StringBuilder();
            var dataGeracao = DateTime.Now;

            // --- HEADER (REGISTRO TIPO 0) ---
            sb.Append("01REMESSA01COBRANCA       ");
            sb.Append(cedente.Codigo.PadLeft(5, '0'));
            sb.Append(cedente.CPFCNPJ.PadLeft(14, '0'));
            sb.Append(new string(' ', 31));
            sb.Append("748SICREDI".PadRight(15));
            sb.Append(new string(' ', 3));
            sb.Append(dataGeracao.ToString("yyyyMMdd"));
            sb.Append(new string(' ', 8));
            sb.Append("1".PadLeft(7, '0'));
            sb.Append(new string(' ', 273));
            sb.Append("2.00");
            sb.Append("000001");
            sb.AppendLine();

            int sequencialRegistro = 2;
            foreach (var boletoInfo in boletosParaGerar)
            {
                var associado = associados.FirstOrDefault(a => a.Id == boletoInfo.AssociadoId);
                if (associado == null)
                {
                    continue;
                }

                // Define o valor do boleto: usa o valor específico se fornecido, senão, usa o padrão.
                var valorBoleto = boletoInfo.Valor.HasValue && boletoInfo.Valor > 0 ? boletoInfo.Valor.Value : VALOR_PADRAO_MENSALIDADE;

                var nossoNumeroSequencial = (sequencialRegistro / 2);
                var nossoNumeroCompleto = GerarNossoNumero(cedente.Agencia, cedente.Posto, cedente.Codigo, nossoNumeroSequencial);

                var boleto = new BoletoEntidade
                {
                    AssociadoId = associado.Id,
                    Valor = valorBoleto,
                    DataVencimento = new DateTime(dataGeracao.Year, dataGeracao.Month, DateTime.DaysInMonth(dataGeracao.Year, dataGeracao.Month)), // Vencimento no último dia do mês corrente
                    DataEmissao = dataGeracao,
                    NossoNumero = nossoNumeroCompleto,
                    Status = Domain.BoletoStatus.Gerado,
                    JurosMora = 0.20M,
                    PercentualMulta = 2.00M
                };
                boletos.Add(boleto);
                
                // --- MENSAGEM PADRÃO E DINÂMICA ---
                var valorFormatado = boleto.Valor.ToString("N2", new CultureInfo("pt-BR"));

                var mensagens = new List<string>
                {
                    // Linha 1: Cabeçalho fixo, conforme o arquivo .txt
                    "Dependente      Descricao      Ref.       Data Venc       Valor",
                    
                    // Linha 2: Dados dinâmicos com o espaçamento do arquivo .txt
                    $"                01.01-MENSALID {boleto.DataVencimento:MM/yyyy}    {boleto.DataVencimento:dd/MM/yyyy}      {valorFormatado}"
                };

                // --- REGISTRO DETALHE (TIPO 1) ---
                sb.Append("1");
                sb.Append("A");
                sb.Append("A");
                sb.Append("A"); // Tipo de Impressão Normal
                sb.Append(" ");
                sb.Append(" ");
                sb.Append(new string(' ', 10));
                sb.Append("A");
                sb.Append("A"); // Juros em Valor
                sb.Append("A"); // Multa em Percentual
                sb.Append(new string(' ', 28));
                sb.Append(boleto.NossoNumero);
                sb.Append(new string(' ', 6));
                sb.Append(dataGeracao.ToString("yyyyMMdd"));
                sb.Append(" ");
                sb.Append("N");
                sb.Append(" ");
                sb.Append("B");
                sb.Append("00");
                sb.Append("00");
                sb.Append(new string(' ', 4));
                sb.Append("0".PadLeft(10, '0'));
                sb.Append(((long)(boleto.PercentualMulta * 100)).ToString().PadLeft(4, '0'));
                sb.Append(new string(' ', 12));
                sb.Append("01");
                sb.Append(boleto.AssociadoId.ToString().PadRight(10)); // Usando o ID do associado como "Seu Número"
                sb.Append(boleto.DataVencimento.ToString("ddMMyy"));
                sb.Append(((long)(boleto.Valor * 100)).ToString().PadLeft(13, '0'));
                sb.Append("   ");
                sb.Append("     ");
                sb.Append("J");
                sb.Append("N");
                sb.Append(boleto.DataEmissao.ToString("ddMMyy"));
                sb.Append("00");
                sb.Append("00");
                sb.Append(((long)(boleto.JurosMora * 100)).ToString().PadLeft(13, '0'));
                sb.Append("0".PadLeft(6, '0'));
                sb.Append("0".PadLeft(13, '0'));
                sb.Append("00");
                sb.Append("00");
                sb.Append(new string(' ', 9));
                sb.Append("0".PadLeft(13, '0'));
                sb.Append(associado.CPF.Length == 11 ? "1" : "2");
                sb.Append("0");
                sb.Append(associado.CPF.Replace(".", "").Replace("-", "").Replace("/", "").PadLeft(14, '0'));
                sb.Append(associado.Nome.PadRight(40).Substring(0, 40));
                sb.Append(associado.Endereco.PadRight(40).Substring(0, 40));
                sb.Append("".PadLeft(12, ' '));
                sb.Append((associado.Cep + "00000000").Substring(0, 8));
                sb.Append("".PadLeft(5, '0'));
                sb.Append(new string(' ', 55));
                sb.Append(sequencialRegistro.ToString().PadLeft(6, '0'));
                sb.AppendLine();

                sequencialRegistro++;

                // --- REGISTRO MENSAGEM (TIPO 2) ---
                if (mensagens.Any())
                {
                    sb.Append("2");
                    sb.Append(new string(' ', 11));
                    sb.Append(boleto.NossoNumero);
                    sb.Append((mensagens.ElementAtOrDefault(0) ?? "").PadRight(80));
                    sb.Append((mensagens.ElementAtOrDefault(1) ?? "").PadRight(80));
                    sb.Append(new string(' ', 161));
                    sb.Append(new string(' ', 52));
                    sb.Append(sequencialRegistro.ToString().PadLeft(6, '0'));
                    sb.AppendLine();

                    sequencialRegistro++;
                }
            }

            // --- TRAILER (REGISTRO TIPO 9) ---
            sb.Append("91748");
            sb.Append(cedente.Codigo.PadLeft(5, '0'));
            sb.Append(new string(' ', 384));
            sb.Append(sequencialRegistro.ToString().PadLeft(6, '0'));
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
            return $"{codigoCedente}{mesCodigo}{data.Day:D2}.CRM";
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