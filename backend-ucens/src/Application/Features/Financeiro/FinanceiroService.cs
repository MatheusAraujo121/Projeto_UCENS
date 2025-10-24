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
            // ETAPA 1: Encontrar e atualizar boletos pendentes que já venceram
            var boletosVencidos = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.Pendente && b.DataVencimento.Date < DateTime.Today)
                .ToListAsync();

            if (boletosVencidos.Any())
            {
                _logger.LogInformation("Encontrados {Count} boletos pendentes que venceram. Atualizando status para 'Vencido'.", boletosVencidos.Count);
                foreach (var boleto in boletosVencidos)
                {
                    boleto.Status = BoletoStatus.Vencido;
                }
                await _boletoRepo.SaveChangesAsync(); 
                
                // >>> LÓGICA ADICIONADA: ATUALIZA A SITUAÇÃO DO ASSOCIADO PARA INADIMPLENTE <<<
                var associadoIdsComBoletosVencidos = boletosVencidos.Select(b => b.AssociadoId).Distinct().ToArray();
                var associadosParaAtualizar = await _associadoRepo.GetAssociadosByIds(associadoIdsComBoletosVencidos);

                foreach (var associado in associadosParaAtualizar)
                {
                    if (associado.Situacao != "Inadimplente")
                    {
                        associado.Situacao = "Inadimplente";
                        await _associadoRepo.Update(associado);
                        _logger.LogInformation("Associado ID {AssociadoId} atualizado para 'Inadimplente' devido a boleto vencido.", associado.Id);
                    }
                }
            }

            // ETAPA 2: Retornar a lista completa e agora atualizada para o frontend
            return await _boletoRepo.GetQueryable()
                .Include(b => b.Associado)
                .OrderByDescending(b => b.Id)
                .Select(b => new BoletoDTO
                {
                    Id = b.Id,
                    AssociadoId = b.AssociadoId,
                    Valor = b.Valor,
                    Vencimento = b.DataVencimento,
                    Status = b.Status.ToString(),
                    NossoNumero = b.NossoNumero,
                    MotivoCancelamento = b.MotivoCancelamento,
                    DataEmissao = b.DataEmissao,
                    DataPagamento = b.DataPagamento,
                    ValorPago = b.ValorPago,
                    Associado = new AssociadoBoletoDto
                    {
                        Nome = b.Associado != null ? b.Associado.Nome : string.Empty
                    }
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<BoletoDTO>> GetHistoricoBoletosPorAssociadoAsync(int associadoId)
        {
            return await _boletoRepo.GetQueryable()
                .Where(b => b.AssociadoId == associadoId)
                .Include(b => b.Associado)
                .OrderByDescending(b => b.DataVencimento)
                .Select(b => new BoletoDTO
                {
                    Id = b.Id,
                    AssociadoId = b.AssociadoId,
                    Valor = b.Valor,
                    Vencimento = b.DataVencimento,
                    Status = b.Status.ToString(),
                    Associado = new AssociadoBoletoDto
                    {
                        Nome = b.Associado != null ? b.Associado.Nome : string.Empty
                    }
                })
                .ToListAsync();
        }

        public async Task<BoletoDTO?> GetBoletoByIdAsync(int boletoId)
        {
            var boleto = await _boletoRepo.GetQueryable()
                .Include(b => b.Associado)
                .FirstOrDefaultAsync(b => b.Id == boletoId);

            if (boleto == null)
            {
                return null;
            }

            return new BoletoDTO
            {
                Id = boleto.Id,
                AssociadoId = boleto.AssociadoId,
                Valor = boleto.Valor,
                Vencimento = boleto.DataVencimento,
                Status = boleto.Status.ToString(),
                Associado = new AssociadoBoletoDto
                {
                    Nome = boleto.Associado?.Nome ?? string.Empty
                },
                DataEmissao = boleto.DataEmissao,
                NossoNumero = boleto.NossoNumero,
                MotivoCancelamento = boleto.MotivoCancelamento,
                DataPagamento = boleto.DataPagamento,
                ValorPago = boleto.ValorPago
            };
        }
        public async Task<bool> SolicitarCancelamentoBoletoAsync(int boletoId, string motivo)
        {
            var boleto = await _boletoRepo.GetQueryable().FirstOrDefaultAsync(b => b.Id == boletoId);

            // Correção: Permite cancelamento de boletos Vencidos também
            if (boleto == null || (boleto.Status != BoletoStatus.Pendente && boleto.Status != BoletoStatus.Vencido))
            {
                _logger.LogWarning("Tentativa de cancelar boleto ID {BoletoId} com status inválido: {Status}", boletoId, boleto?.Status);
                return false;
            }

            boleto.Status = BoletoStatus.CancelamentoSolicitado;
            boleto.MotivoCancelamento = motivo; 

            await _boletoRepo.Update(boleto);
            _logger.LogInformation("Solicitação de cancelamento para o Boleto ID {BoletoId} registrada. Motivo: {Motivo}", boletoId, motivo);

            return true;
        }

        public async Task<ResultadoArquivoRemessa> GerarArquivoRemessaAsync(List<BoletoParaGeracaoDto> boletosParaGerar)
        {
            if (boletosParaGerar == null)
            {
                boletosParaGerar = new List<BoletoParaGeracaoDto>();
            }

            var boletosParaCancelar = await _boletoRepo.GetQueryable()
                .Include(b => b.Associado)
                .Where(b => b.Status == BoletoStatus.CancelamentoSolicitado)
                .ToListAsync();

            if (!boletosParaGerar.Any() && !boletosParaCancelar.Any())
            {
                throw new InvalidOperationException("Não há boletos para gerar nem para cancelar.");
            }

            var associadoIds = boletosParaGerar.Select(b => b.AssociadoId)
                                              .Union(boletosParaCancelar.Select(b => b.AssociadoId))
                                              .Distinct()
                                              .ToArray();
            
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

            // 1. PROCESSAR NOVOS BOLETOS PARA REGISTRO
            foreach (var boletoInfo in boletosParaGerar)
            {
                ultimoSequencial++;
                var associado = associados[boletoInfo.AssociadoId];
                var valorBoleto = boletoInfo.Valor.GetValueOrDefault(VALOR_PADRAO_MENSALIDADE);
                var dataVencimento = boletoInfo.DataVencimento.GetValueOrDefault(new DateTime(dataGeracao.Year, dataGeracao.Month, DateTime.DaysInMonth(dataGeracao.Year, dataGeracao.Month)));

                if (valorBoleto <= 0)
                    throw new InvalidOperationException($"Valor do boleto para o associado {associado.Id} deve ser positivo.");

                var nossoNumeroCompleto = GerarNossoNumero(beneficiario, postoBeneficiario, ultimoSequencial);

                // Linha1 já está corrigida (sem "Descrição")
                string linha1 = ("Dependente".PadRight(15) + "Descricao".PadRight(15) + "Ref.".PadRight(12) + "Data Venc".PadRight(16) + "Valor").PadRight(80);
                string referencia = $"01.01-MENSALID {dataVencimento:MM/yyyy}";
                string vencimento = dataVencimento.ToString("dd/MM/yyyy");
                string valorFormatado = valorBoleto.ToString("F2", new CultureInfo("pt-BR"));
                string linha2 = (referencia.PadRight(42) + vencimento.PadRight(16) + valorFormatado).PadRight(80);
                
                // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                string enderecoCompleto = SanitizeCnabString($"{associado.Endereco}, {associado.Numero}");

                var boleto = new BNet.Boleto(banco)
                {
                    Pagador = new BNet.Pagador
                    {
                        CPFCNPJ = associado.CPF.Replace(".", "").Replace("-", ""),
                        // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                        Nome = SanitizeCnabString(associado.Nome),
                        Endereco = new BNet.Endereco
                        {
                            // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                            LogradouroEndereco = enderecoCompleto,
                            Bairro = SanitizeCnabString(associado.Bairro),
                            Cidade = SanitizeCnabString(associado.Cidade),
                            UF = SanitizeCnabString(associado.UF), // UF geralmente não tem acentos, mas é bom garantir
                            CEP = associado.Cep.Replace("-", "")
                        }
                    },
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
                    CodigoMovimentoRetorno = "01", 
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
                    // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                    NomeAssociado = SanitizeCnabString(associado.Nome), // Limpa o nome que retorna para o front-end também
                    NossoNumero = boleto.NossoNumero,
                    Valor = boleto.ValorTitulo,
                    DataVencimento = boleto.DataVencimento,
                    LinhaDigitavel = boleto.CodigoBarra.LinhaDigitavel,
                    CodigoDeBarras = boleto.CodigoBarra.CodigoDeBarras
                });
            }

            // 2. PROCESSAR BOLETOS PARA CANCELAMENTO (BAIXA)
            foreach (var boletoParaCancelar in boletosParaCancelar)
            {
                var associado = associados[boletoParaCancelar.AssociadoId];
                // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                string enderecoCompleto = SanitizeCnabString($"{associado.Endereco}, {associado.Numero}");

                var boletoCancelamento = new BNet.Boleto(banco)
                {
                    CodigoMovimentoRetorno = "02", // Ocorrência "02" significa "Pedido de Baixa"
                    NossoNumero = boletoParaCancelar.NossoNumero,
                    NumeroDocumento = boletoParaCancelar.SequencialNossoNumero.ToString("D10"),
                    ValorTitulo = boletoParaCancelar.Valor,
                    DataVencimento = boletoParaCancelar.DataVencimento,
                    EspecieDocumento = BNet.TipoEspecieDocumento.DSI,
                    Pagador = new BNet.Pagador
                    {
                        CPFCNPJ = associado.CPF.Replace(".", "").Replace("-", ""),
                        // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                        Nome = SanitizeCnabString(associado.Nome),
                        Endereco = new BNet.Endereco
                        {
                            // ***** CORREÇÃO DE SANITIZAÇÃO APLICADA *****
                            LogradouroEndereco = enderecoCompleto,
                            Bairro = SanitizeCnabString(associado.Bairro),
                            Cidade = SanitizeCnabString(associado.Cidade),
                            UF = SanitizeCnabString(associado.UF),
                            CEP = associado.Cep.Replace("-", "")
                        }
                    }
                };
                boletos.Add(boletoCancelamento);
                
                boletoParaCancelar.Status = BoletoStatus.CancelamentoEnviado; 
                boletoParaCancelar.NumeroArquivoRemessa = novoNumeroRemessa; // Atribui o número da remessa ao boleto
                _logger.LogInformation("Incluindo pedido de baixa para o Boleto ID {BoletoId} e alterando status para CancelamentoEnviado.", boletoParaCancelar.Id);
            }


            if (!boletos.Any())
            {
                return new ResultadoArquivoRemessa();
            }

            using (var memoryStream = new MemoryStream())
            {
                var arquivoRemessa = new BNet.ArquivoRemessa(banco, BNet.TipoArquivo.CNAB400, novoNumeroRemessa);
                arquivoRemessa.GerarArquivoRemessa(boletos, memoryStream);

                if (boletosParaSalvar.Any())
                {
                    await _boletoRepo.AddRangeAsync(boletosParaSalvar);
                }
                
                if (boletosParaCancelar.Any())
                {
                    foreach (var boletoEmCancelamento in boletosParaCancelar)
                    {
                        await _boletoRepo.Update(boletoEmCancelamento);
                    }
                }

                await _boletoRepo.SaveChangesAsync();

                return new ResultadoArquivoRemessa
                {
                    ConteudoArquivo = memoryStream.ToArray(),
                    NomeArquivo = GerarNomeArquivo(beneficiario.Codigo, novoNumeroRemessa),
                    BoletosGerados = boletosGeradosInfo
                };
            }
        }

        // ***** FUNÇÃO DE SANITIZAÇÃO ADICIONADA *****
        /// <summary>
        /// Remove acentos, caracteres especiais e converte para maiúsculo para o padrão CNAB.
        /// </summary>
        private string SanitizeCnabString(string texto)
        {
            if (string.IsNullOrEmpty(texto))
            {
                return string.Empty;
            }

            // 1. Converte para MAIÚSCULO
            texto = texto.ToUpper();

            // 2. Normaliza para decompor acentos (ex: "ÇÃO" -> "C" + "A" + "O" + "̃")
            var normalizedString = texto.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                // 3. Ignora os acentos (NonSpacingMark)
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    // 4. Troca 'Ç' por 'C'
                    if (c == 'Ç')
                    {
                        stringBuilder.Append('C');
                    }
                    // 5. Mantém apenas caracteres ASCII válidos para CNAB
                    // (Letras, números, espaço e pontuação básica permitida)
                    // Verifique o manual do seu banco para a lista exata de caracteres permitidos
                    else if ((c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || 
                             c == ' ' || c == '.' || c == ',' || c == '-' || c == '/' || 
                             c == '(' || c == ')' || c == '&' || c == '+')
                    {
                        stringBuilder.Append(c);
                    }
                    else
                    {
                        // Substitui qualquer outro caractere inválido (ex: @, #, $, %, º, ª) por espaço.
                        stringBuilder.Append(' ');
                    }
                }
            }
        
            // Retorna a string limpa, normalizada de volta.
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
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
                var errorMessages = string.Join("; ", resultadoParse.Errors);
                _logger.LogWarning("Ocorreram erros durante o parse do arquivo de retorno: {ErrorCount} erros. Detalhes: {Errors}", resultadoParse.Errors.Count, errorMessages);
                throw new InvalidDataException($"O arquivo de retorno contém erros que impedem o processamento. Detalhes: {errorMessages}");
            }

            var todosOsRetornos = await _cnabRetornoRepository.GetAll();
            
            var boletosPendentes = await _boletoRepo.GetQueryable()
                .Include(b => b.Associado) // Inclui o associado para a lógica de "Regular"
                .Where(b => b.Status == BoletoStatus.Pendente || b.Status == BoletoStatus.Vencido)
                .ToListAsync();
                
            var boletosAguardandoConfirmacaoCancelamento = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.CancelamentoEnviado)
                .ToListAsync();

            foreach (var detalhe in resultadoParse.Details)
            {
                var nossoNumeroCompleto = detalhe.NossoNumero.Trim();

                if (detalhe.CodigoOcorrencia == "06") // "06" = Liquidação Normal
                {
                    var boletoParaAtualizar = boletosPendentes.FirstOrDefault(b => b.NossoNumero == nossoNumeroCompleto);
                    if (boletoParaAtualizar != null)
                    {
                        boletoParaAtualizar.Status = BoletoStatus.Pago;
                        boletoParaAtualizar.DataPagamento = detalhe.DataOcorrencia;
                        boletoParaAtualizar.ValorPago = detalhe.ValorPago;
                        _logger.LogInformation("Boleto ID {BoletoId} (NossoNumero: {NossoNumero}) marcado para ser atualizado para 'Pago'.", boletoParaAtualizar.Id, nossoNumeroCompleto);

                        // >>> LÓGICA ADICIONADA: VERIFICA SE O ASSOCIADO PODE VOLTAR A SER REGULAR <<<
                        // Verifica se há OUTROS boletos pendentes ou vencidos para este associado
                        var outrosBoletosPendentes = await _boletoRepo.GetQueryable()
                            .AnyAsync(b => b.AssociadoId == boletoParaAtualizar.AssociadoId && 
                                           b.Id != boletoParaAtualizar.Id && 
                                          (b.Status == BoletoStatus.Pendente || b.Status == BoletoStatus.Vencido));

                        if (!outrosBoletosPendentes && boletoParaAtualizar.Associado != null && boletoParaAtualizar.Associado.Situacao == "Inadimplente")
                        {
                            boletoParaAtualizar.Associado.Situacao = "Regular";
                            _logger.LogInformation("Associado ID {AssociadoId} não possui mais pendências. Atualizando para 'Regular'.", boletoParaAtualizar.AssociadoId);
                            // Não precisa chamar _associadoRepo.Update() se o contexto do _boletoRepo estiver rastreando o associado
                        }
                    }
                    else
                    {
                        _logger.LogWarning("Boleto com NossoNumero {NossoNumero} não encontrado na lista de pendentes/vencidos para pagamento.", nossoNumeroCompleto);
                    }
                }
                else if (detalhe.CodigoOcorrencia == "09") // "09" = Baixado automaticamente via arquivo
                {
                    var boletoParaConfirmarCancelamento = boletosAguardandoConfirmacaoCancelamento.FirstOrDefault(b => b.NossoNumero == nossoNumeroCompleto);
                    if (boletoParaConfirmarCancelamento != null)
                    {
                        boletoParaConfirmarCancelamento.Status = BoletoStatus.Cancelado;
                        boletoParaConfirmarCancelamento.MotivoCancelamento += " (Baixa confirmada pelo banco.)";
                        _logger.LogInformation("Boleto ID {BoletoId} (NossoNumero: {NossoNumero}) confirmado como 'Cancelado' pelo banco.", boletoParaConfirmarCancelamento.Id, nossoNumeroCompleto);
                    }
                    else
                    {
                         _logger.LogWarning("Boleto com NossoNumero {NossoNumero} para confirmação de baixa não encontrado na lista de 'CancelamentoEnviado'.", nossoNumeroCompleto);
                    }
                }

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
            
            // Salva todas as alterações (Pagos, Cancelados, Regulares, novos CnabRetorno)
            await _boletoRepo.SaveChangesAsync();
            _logger.LogInformation("Processamento do arquivo de retorno finalizado.");
        }
    }
}