using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using BoletoNetCore;
using Domain;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;

namespace Application.Features.Financeiro
{
    public class FinanceiroService
    {
        private readonly AppDbContext _context;
        private readonly IAssociadoRepository _associadoRepo;

        public FinanceiroService(AppDbContext context, IAssociadoRepository associadoRepo)
        {
            _context = context;
            _associadoRepo = associadoRepo;
        }

        public async Task<string> GerarArquivoRemessa(int[] associadoIds, decimal valor, DateTime dataVencimento)
        {
            var associados = await _associadoRepo.GetAssociadosByIds(associadoIds);
            var boletos = new List<Boleto>();

            // Configurações do Cedente (Beneficiário) - Mover para appsettings.json
            var cedente = new
            {
                [cite_start]Codigo = "00623", // Seu código de beneficiário [cite: 95]
                [cite_start]Posto = "02", // Seu posto [cite: 94]
                [cite_start]Agencia = "0165", // Sua agência [cite: 93]
                Conta = "00623", // Sua conta
                DigitoConta = "0", // Digito da conta
                CPFCNPJ = "12345678000199", // Seu CNPJ
                Nome = "NOME DA SUA EMPRESA"
            };

            var banco = Banco.Sicredi;

            var sb = new StringBuilder();

            // 1. REGISTRO HEADER [cite: 562]
            var header = new
            {
                IdentificacaoRegistro = "0",
                IdentificacaoArquivo = "1",
                LiteralRemessa = "REMESSA",
                CodigoServico = "01",
                LiteralServico = "COBRANCA",
                CodigoCedente = cedente.Codigo.PadLeft(5, '0'),
                NomeCedente = cedente.Nome.PadRight(30).Substring(0, 30),
                NumeroBanco = "748",
                NomeBanco = "SICREDI".PadRight(15),
                DataGeracao = DateTime.Now.ToString("ddMMyy"),
                NumeroSequencialRemessa = "1".PadLeft(7, '0'), // Controlar este número
                VersaoSistema = "2.00"
            };
            sb.AppendLine(
              $"{header.IdentificacaoRegistro}{header.IdentificacaoArquivo}{header.LiteralRemessa.PadRight(7)}{header.CodigoServico.PadLeft(2, '0')}{header.LiteralServico.PadRight(15)}{"".PadRight(20)}{header.CodigoCedente.PadLeft(5, '0')}{cedente.Nome.PadRight(30)}{header.NumeroBanco}{header.NomeBanco}{header.DataGeracao}{"".PadRight(294)}{"000001"}");


            int sequencialRegistro = 2;
            foreach (var associado in associados)
            {
                var nossoNumero = GerarNossoNumero(cedente.Agencia, cedente.Posto, cedente.Codigo, sequencialRegistro);
                
                var boleto = new Boleto
                {
                    AssociadoId = associado.Id,
                    Valor = valor,
                    DataVencimento = dataVencimento,
                    DataEmissao = DateTime.Now,
                    NossoNumero = nossoNumero,
                    Status = BoletoStatus.Gerado,
                    JurosMora = 0.20M, // Exemplo: R$ 0,20 ao dia
                    PercentualMulta = 2.00M, // Exemplo: 2%
                };
                boletos.Add(boleto);
                _context.Boletos.Add(boleto);

                // 2. REGISTRO DETALHE (TIPO 1) [cite: 564]
                var detalhe = new
                {
                    IdRegistro = "1",
                    TipoCobranca = "A",
                    TipoCarteira = "A", // A = Simples
                    TipoImpressao = "A", // A = Normal
                    NossoNumero = boleto.NossoNumero,
                    SeuNumero = boleto.Id.ToString().PadLeft(10, '0'),
                    DataVencimento = boleto.DataVencimento.ToString("ddMMyy"),
                    ValorTitulo = boleto.Valor.ToString("F2").Replace(",", "").PadLeft(13, '0'),
                    EspecieDocumento = "A", // Duplicata Mercantil
                    Aceite = "N", // N-Não
                    DataEmissao = boleto.DataEmissao.ToString("ddMMyy"),
                    InstrucaoProtesto = "06", // Protestar
                    DiasProtesto = "05", // 5 dias corridos após vencimento
                    JurosMora = boleto.JurosMora?.ToString("F2").Replace(",", "").PadLeft(13, '0') ?? "".PadLeft(13, '0'),
                    DataLimiteDesconto = "000000",
                    ValorDesconto = "".PadLeft(13, '0'),
                    ValorAbatimento = "".PadLeft(13, '0'),
                    TipoInscricaoPagador = "1", // 1-CPF, 2-CNPJ
                    CpfCnpjPagador = associado.CPF.Replace(".", "").Replace("-", "").PadLeft(14, '0'),
                    NomePagador = associado.Nome.PadRight(40).Substring(0, 40),
                    EnderecoPagador = associado.Endereco.PadRight(40).Substring(0, 40),
                    CepPagador = "00000000" // Adicionar CEP ao associado
                };

                sb.AppendLine(
                    $"1A A{detalhe.NossoNumero}{"".PadRight(25)}{detalhe.SeuNumero.PadRight(10)}{detalhe.DataVencimento}{detalhe.ValorTitulo}{"748"}{"00000"}{detalhe.EspecieDocumento}{detalhe.Aceite}{detalhe.DataEmissao}{detalhe.InstrucaoProtesto}{detalhe.DiasProtesto}{detalhe.JurosMora}{detalhe.DataLimiteDesconto}{detalhe.ValorDesconto}{"".PadLeft(13, '0')}{detalhe.ValorAbatimento}{detalhe.TipoInscricaoPagador}{detalhe.CpfCnpjPagador}{detalhe.NomePagador}{detalhe.EnderecoPagador}{"".PadLeft(12)}{detalhe.CepPagador}{"".PadRight(60)}{sequencialRegistro.ToString().PadLeft(6, '0')}"
                );
                sequencialRegistro++;
            }

            // 3. REGISTRO TRAILLER (TIPO 9) [cite: 603]
            sb.AppendLine($"9{"".PadRight(393)}{sequencialRegistro.ToString().PadLeft(6, '0')}");

            await _context.SaveChangesAsync();
            return sb.ToString();
        }

        private string GerarNossoNumero(string agencia, string posto, string cedente, int sequencial)
        {
            // Formato: AA/BXXXXX-D [cite: 35]
            string ano = DateTime.Now.ToString("yy");
            string byteGeracao = "2"; // 2 a 9 para beneficiário [cite: 37, 41]
            string numeroSequencial = sequencial.ToString().PadLeft(5, '0');
            
            string baseCalculo = $"{agencia}{posto}{cedente}{ano}{byteGeracao}{numeroSequencial}";
            
            // Cálculo do DV Módulo 11 [cite: 42]
            int soma = 0;
            int peso = 2;
            for (int i = baseCalculo.Length - 1; i >= 0; i--)
            {
                soma += Convert.ToInt32(baseCalculo[i].ToString()) * peso;
                peso++;
                if (peso > 9)
                    peso = 2;
            }
            int resto = soma % 11;
            int dv = 11 - resto;
            if (dv == 0 || dv == 10 || dv == 11)
            {
                dv = 0;
            }

            return $"{ano}{byteGeracao}{numeroSequencial}{dv}";
        }
    }
}