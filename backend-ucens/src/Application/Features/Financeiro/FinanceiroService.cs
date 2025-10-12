using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Features.Cnab;
using Domain;
using Microsoft.Extensions.Logging;
using BNet = BoletoNetCore;
using Microsoft.EntityFrameworkCore;
using BoletoEntidade = Domain.Boleto;

namespace Application.Features.Financeiro
{
    public class ResultadoArquivoRemessa
    {
        public byte[] ConteudoArquivo { get; set; } = Array.Empty<byte>();
        public string NomeArquivo { get; set; } = "";
        public List<BoletoGeradoDto> BoletosGerados { get; set; } = new List<BoletoGeradoDto>();
    }

    public class FinanceiroService
    {
        private readonly IAssociadoRepository _associadoRepo;
        private readonly IBoletoRepository _boletoRepo;
        private readonly ICnab400SicrediParser _cnabParser;
        private readonly ILogger<FinanceiroService> _logger;
        private readonly IRepository<CnabRetorno> _cnabRetornoRepository;
        private const decimal VALOR_PADRAO_MENSALIDADE = 90.00M;

        public FinanceiroService(IAssociadoRepository associadoRepo, IBoletoRepository boletoRepo, ICnab400SicrediParser cnabParser, ILogger<FinanceiroService> logger, IRepository<CnabRetorno> cnabRetornoRepository)
        {
            _associadoRepo = associadoRepo ?? throw new ArgumentNullException(nameof(associadoRepo));
            _boletoRepo = boletoRepo ?? throw new ArgumentNullException(nameof(boletoRepo));
            _cnabParser = cnabParser;
            _logger = logger;
            _cnabRetornoRepository = cnabRetornoRepository;
        }

        public async Task<IEnumerable<BoletoDTO>> GetBoletosAsync()
        {
            return await _boletoRepo.GetQueryable()
                .Include(b => b.Associado) // Inclui os dados do associado
                .OrderByDescending(b => b.DataEmissao)
                .Select(b => new BoletoDTO
                {
                    Id = b.Id,
                    AssociadoId = b.AssociadoId,
                    Valor = b.Valor,
                    Vencimento = b.DataVencimento,
                    Status = b.Status.ToString(), // Converte o enum para string
                    Associado = new AssociadoBoletoDto
                    {
                        Nome = b.Associado != null ? b.Associado.Nome : string.Empty
                    }
                })
                .ToListAsync();
        }

        public async Task<ResultadoArquivoRemessa> GerarArquivoRemessaAsync(List<BoletoParaGeracaoDto> boletosParaGerar)
        {
            if (boletosParaGerar == null || !boletosParaGerar.Any())
            {
                throw new InvalidOperationException("A lista de boletos para geração não pode estar vazia.");
            }

            var associadoIds = boletosParaGerar.Select(b => b.AssociadoId).Distinct().ToArray();
            var associados = (await _associadoRepo.GetAssociadosByIds(associadoIds))
                .ToDictionary(a => a.Id);

            var idsNaoEncontrados = associadoIds.Where(id => !associados.ContainsKey(id)).ToList();
            if (idsNaoEncontrados.Any())
            {
                throw new InvalidOperationException($"Associados não encontrados para os seguintes IDs: [{string.Join(", ", idsNaoEncontrados)}].");
            }

            var dataGeracao = DateTime.Now;

            var ultimoNumeroRemessa = await _boletoRepo.GetQueryable()
                                          .MaxAsync(b => (int?)b.NumeroArquivoRemessa) ?? 0;
            var novoNumeroRemessa = ultimoNumeroRemessa + 1;

            const string postoBeneficiario = "01";

            var beneficiario = new BNet.Beneficiario
            {
                CPFCNPJ = "48388334000100",
                Nome = "UCENS",
                Codigo = "57118",
                ContaBancaria = new BNet.ContaBancaria
                {
                    Agencia = "0718",
                    DigitoAgencia = "",
                    Conta = "57118",
                    DigitoConta = "8",
                    CarteiraPadrao = "1",
                    VariacaoCarteiraPadrao = "A",
                    TipoFormaCadastramento = BNet.TipoFormaCadastramento.ComRegistro,
                    TipoImpressaoBoleto = BNet.TipoImpressaoBoleto.Empresa,
                }
            };

            var banco = BNet.Banco.Instancia(BNet.Bancos.Sicredi);
            banco.Beneficiario = beneficiario;

            var boletos = new BNet.Boletos();
            var boletosParaSalvar = new List<BoletoEntidade>();
            var boletosGeradosInfo = new List<BoletoGeradoDto>();
            
            var ultimoSequencial = await _boletoRepo.GetQueryable()
                                     .MaxAsync(b => (int?)b.SequencialNossoNumero) ?? 0;

            foreach (var boletoInfo in boletosParaGerar)
            {
                ultimoSequencial++;
                var associado = associados[boletoInfo.AssociadoId];
                var valorBoleto = boletoInfo.Valor.GetValueOrDefault(VALOR_PADRAO_MENSALIDADE);
                var dataVencimento = boletoInfo.DataVencimento.GetValueOrDefault(new DateTime(dataGeracao.Year, dataGeracao.Month, DateTime.DaysInMonth(dataGeracao.Year, dataGeracao.Month)));

                if (valorBoleto <= 0)
                    throw new InvalidOperationException($"Valor do boleto para o associado {associado.Id} deve ser positivo.");

                var nossoNumeroCompleto = GerarNossoNumero(beneficiario, postoBeneficiario, ultimoSequencial);

                // Garantindo que ambas as linhas da mensagem tenham exatamente 80 caracteres.
                string linha1 = ("Dependente".PadRight(15) + "Descricao".PadRight(15) + "Ref.".PadRight(12) + "Data Venc".PadRight(16) + "Valor").PadRight(80);
                string referencia = $"01.01-MENSALID {dataVencimento:MM/yyyy}";
                string vencimento = dataVencimento.ToString("dd/MM/yyyy");
                string valorFormatado = valorBoleto.ToString("F2", new CultureInfo("pt-BR"));
                string linha2 = (referencia.PadRight(42) + vencimento.PadRight(16) + valorFormatado).PadRight(80);
                
                string enderecoCompleto = $"{associado.Endereco}, {associado.Numero}";

                var boleto = new BNet.Boleto(banco)
                {
                    Pagador = new BNet.Pagador
                    {
                        CPFCNPJ = associado.CPF.Replace(".", "").Replace("-", ""),
                        Nome = associado.Nome,
                        Endereco = new BNet.Endereco
                        {
                            LogradouroEndereco = enderecoCompleto,
                            Bairro = associado.Bairro,
                            Cidade = associado.Cidade,
                            UF = associado.UF,
                            CEP = associado.Cep.Replace("-", "")
                        }
                    },
                    // Garantindo que o "Seu Número" tenha sempre 10 caracteres.
                    NumeroDocumento = ultimoSequencial.ToString("D10"),
                    NossoNumero = nossoNumeroCompleto,
                    ValorTitulo = valorBoleto,
                    DataVencimento = dataVencimento,
                    DataEmissao = dataGeracao,
                    DataProcessamento = dataGeracao,
                    PercentualMulta = 2.00M,
                    ValorJurosDia = 0.10M, 
                    EspecieDocumento = BNet.TipoEspecieDocumento.DSI, 
                    Aceite = "N",
                    CodigoInstrucao1 = "01",
                    
                    // Usando as propriedades corretas que você descobriu
                    MensagemProtesto = linha1,
                    MensagemLivre = linha2
                };
                
                boletos.Add(boleto);

                boletosParaSalvar.Add(new BoletoEntidade
                {
                    AssociadoId = associado.Id,
                    Valor = valorBoleto,
                    DataVencimento = dataVencimento,
                    DataEmissao = dataGeracao,
                    NossoNumero = boleto.NossoNumero,
                    Status = Domain.BoletoStatus.Pendente,
                    JurosMora = 0.10M,
                    PercentualMulta = 2.00M,
                    NumeroArquivoRemessa = novoNumeroRemessa,
                    SequencialNossoNumero = ultimoSequencial
                });

                boletosGeradosInfo.Add(new BoletoGeradoDto
                {
                    AssociadoId = associado.Id,
                    NomeAssociado = associado.Nome,
                    NossoNumero = boleto.NossoNumero,
                    Valor = boleto.ValorTitulo,
                    DataVencimento = boleto.DataVencimento,
                    LinhaDigitavel = boleto.CodigoBarra.LinhaDigitavel,
                    CodigoDeBarras = boleto.CodigoBarra.CodigoDeBarras
                });
            }

            if (!boletos.Any())
            {
                return new ResultadoArquivoRemessa();
            }

            using (var memoryStream = new MemoryStream())
            {
                var arquivoRemessa = new BNet.ArquivoRemessa(banco, BNet.TipoArquivo.CNAB400, novoNumeroRemessa);
                arquivoRemessa.GerarArquivoRemessa(boletos, memoryStream);

                await _boletoRepo.AddRangeAsync(boletosParaSalvar);
                await _boletoRepo.SaveChangesAsync();

                return new ResultadoArquivoRemessa
                {
                    ConteudoArquivo = memoryStream.ToArray(),
                    NomeArquivo = GerarNomeArquivo(beneficiario.Codigo, novoNumeroRemessa),
                    BoletosGerados = boletosGeradosInfo
                };
            }
        }

        private string GerarNomeArquivo(string codigoCedente, int numeroRemessa)
        {
            var data = DateTime.Now;
            var mesCodigo = data.Month switch
            {
                10 => "O",
                11 => "N",
                12 => "D",
                _ => data.Month.ToString("X")
            };
            return $"{codigoCedente}{mesCodigo}{data.Day:D2}.txt";
        }

        private string GerarNossoNumero(BNet.Beneficiario beneficiario, string posto, int sequencial)
        {
            string ano = DateTime.Now.ToString("yy");
            string byteGeracao = "2";
            string numeroSequencial = sequencial.ToString("D5");

            string agencia = beneficiario.ContaBancaria.Agencia;
            string codigoCedente = beneficiario.Codigo.PadLeft(5, '0');

            string baseCalculo = $"{agencia}{posto.PadLeft(2, '0')}{codigoCedente}{ano}{byteGeracao}{numeroSequencial}";

            int soma = 0;
            int peso = 2;
            for (int i = baseCalculo.Length - 1; i >= 0; i--)
            {
                soma += Convert.ToInt32(baseCalculo[i].ToString()) * peso;
                peso = (peso == 9) ? 2 : peso + 1;
            }

            int restoDaDivisao = soma % 11;
            int digitoVerificador = 11 - restoDaDivisao;

            if (digitoVerificador >= 10)
            {
                digitoVerificador = 0;
            }

            return $"{ano}{byteGeracao}{numeroSequencial}{digitoVerificador}";
        }
        
        public async Task ProcessarArquivoRetornoAsync(Stream arquivoStream)
        {
            _logger.LogInformation("Iniciando processamento do arquivo de retorno CNAB400 Sicredi.");

            CnabParseResultDto resultadoParse = await _cnabParser.ParseAsync(arquivoStream);

            if (resultadoParse.HasErrors)
            {
                _logger.LogWarning("Ocorreram erros durante o parse do arquivo de retorno: {ErrorCount} erros.", resultadoParse.Errors.Count);
                resultadoParse.Errors.ForEach(e => _logger.LogWarning(e));
            }

            var todosOsRetornos = await _cnabRetornoRepository.GetAll();
            
            // Carrega todos os boletos pendentes em memória para evitar múltiplas chamadas ao banco
            var boletosPendentes = (await _boletoRepo.GetAll()).Where(b => b.Status == BoletoStatus.Pendente).ToList();

            foreach (var detalhe in resultadoParse.Details)
            {
                // Verifica se a ocorrência é de liquidação (pagamento)
                if (detalhe.CodigoOcorrencia == "06") // "06" = Liquidação Normal
                {
                    // --- INÍCIO DA NOVA LÓGICA ---
                    // Extrai o ID do boleto a partir do NossoNumero (ex: de "250000065" extrai "65")
                    if (int.TryParse(detalhe.NossoNumero.Substring(7), out int boletoId))
                    {
                        // Encontra o boleto correspondente na lista de boletos pendentes
                        var boletoParaAtualizar = boletosPendentes.FirstOrDefault(b => b.Id == boletoId);

                        if (boletoParaAtualizar != null)
                        {
                            // Atualiza o status do boleto para "Pago"
                            boletoParaAtualizar.Status = BoletoStatus.Pago;
                            await _boletoRepo.Update(boletoParaAtualizar);
                            _logger.LogInformation("Boleto ID {BoletoId} atualizado para 'Pago'.", boletoId);
                        }
                        else
                        {
                            _logger.LogWarning("Boleto com ID {BoletoId} não encontrado ou já estava com status 'Pago'.", boletoId);
                        }
                    }
                    else
                    {
                        _logger.LogError("Não foi possível extrair o ID do Boleto a partir do NossoNumero: {NossoNumero}", detalhe.NossoNumero);
                    }
                    // --- FIM DA NOVA LÓGICA ---
                }

                // A lógica para salvar o histórico do retorno continua a mesma
                var chaveUnica = detalhe.GetUniqueKey();
                if (!todosOsRetornos.Any(r => r.ChaveUnica == chaveUnica))
                {
                    var novoRetorno = new CnabRetorno
                    {
                        ChaveUnica = chaveUnica,
                        NossoNumero = detalhe.NossoNumero,
                        DataOcorrencia = detalhe.DataOcorrencia,
                        ValorPago = detalhe.ValorPago,
                        CodigoOcorrencia = detalhe.CodigoOcorrencia,
                    };
                    await _cnabRetornoRepository.Add(novoRetorno);
                }
            }
            
            _logger.LogInformation("Processamento do arquivo de retorno finalizado.");
        }
        
    }
    
}