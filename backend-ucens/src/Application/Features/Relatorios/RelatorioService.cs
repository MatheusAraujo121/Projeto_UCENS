using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore; // Ainda necessário para o ToListAsync e Include
// Importar DTOs que podem ser necessários (ajuste os namespaces conforme seu projeto)
using Application.Features.Usuarios;
using Application.Features.Fornecedores;

namespace Application.Features.Relatorios
{
    public class RelatorioService
    {
        private readonly IAssociadoRepository _associadoRepo;
        private readonly IBoletoRepository _boletoRepo;
        private readonly IRepository<Despesa> _despesaRepo; // Usando IRepository genérico
        private readonly ITransacaoRepository _transacaoRepo;
        
        // --- Novas Injeções ---
        private readonly IDependenteRepository _dependenteRepo;
        private readonly IUserRepository _userRepo;
        private readonly IFornecedorRepository _fornecedorRepo;


        // --- Construtor Atualizado ---
        public RelatorioService(
            IAssociadoRepository associadoRepo,
            IBoletoRepository boletoRepo,
            IRepository<Despesa> despesaRepo,
            ITransacaoRepository transacaoRepo,
            IDependenteRepository dependenteRepo, // Adicionado
            IUserRepository userRepo,             // Adicionado
            IFornecedorRepository fornecedorRepo  // Adicionado
            )
        {
            _associadoRepo = associadoRepo;
            _boletoRepo = boletoRepo;
            _despesaRepo = despesaRepo;
            _transacaoRepo = transacaoRepo;
            _dependenteRepo = dependenteRepo;     // Adicionado
            _userRepo = userRepo;                 // Adicionado
            _fornecedorRepo = fornecedorRepo;     // Adicionado
        }
        
        // --- Relatórios Existentes (Mantidos) ---

        // Relatório de Associados e Dependentes (Já existe na sua lista)
        public async Task<List<object>> GerarRelatorioAssociadosComDependentes()
        {
            var associados = await _associadoRepo.GetAllWithDependentes(); 
            
            // Vamos criar uma lista plana (flat list)
            var listaPlana = new List<object>();

            foreach (var a in associados)
            {
                // Se o associado não tiver dependentes, adicione ele mesmo assim
                if (a.Dependentes == null || !a.Dependentes.Any())
                {
                    listaPlana.Add(new {
                        AssociadoId = a.Id,
                        Associado = a.Nome,
                        CPF = a.CPF,
                        Situacao = a.Situacao,
                        Dependente = "---",
                        Parentesco = "---"
                    });
                }
                else
                {
                    // Se tiver dependentes, crie uma linha para cada um
                    foreach (var d in a.Dependentes)
                    {
                        listaPlana.Add(new {
                            AssociadoId = a.Id,
                            Associado = a.Nome,
                            CPF = a.CPF,
                            Situacao = a.Situacao,
                            Dependente = d.Nome,
                            Parentesco = d.GrauParentesco
                        });
                    }
                }
            }
            
            return listaPlana;
        }

        // Fluxo de Caixa (Já existe na sua lista)
        public async Task<RelatorioFinanceiroDTO> GetFluxoDeCaixa(DateTime dataInicio, DateTime dataFim)
        {
            // Ajustar dataFim para incluir o dia inteiro
            dataFim = dataFim.Date.AddDays(1).AddTicks(-1);

            // Boletos
            var boletosPagosQuery = _boletoRepo.GetQueryable()
                .Include(b => b.Associado) 
                .Where(b => b.Status == BoletoStatus.Pago && b.DataPagamento.HasValue && b.DataPagamento.Value >= dataInicio && b.DataPagamento.Value <= dataFim);
                
            var boletosPagos = await boletosPagosQuery.Select(b => new TransacaoItemDTO
                {
                    Id = b.Id,
                    Data = b.DataPagamento!.Value, 
                    Descricao = $"Boleto de {(b.Associado != null ? b.Associado.Nome : "Associado não encontrado")}",
                    Categoria = "Mensalidade",
                    Tipo = "Entrada",
                    Valor = b.ValorPago.GetValueOrDefault(),
                    Origem = "Boleto"
                }).ToListAsync();

            // Despesas
            var todasDespesas = await _despesaRepo.GetAll(); 
            var despesasPagas = todasDespesas
                .Where(d => (d.Status == "Pago" || d.Status == "Pago com atraso") && d.DataPagamento.HasValue && d.DataPagamento.Value >= dataInicio && d.DataPagamento.Value <= dataFim)
                .Select(d => new TransacaoItemDTO
                {
                    Id = d.Id,
                    Data = d.DataPagamento!.Value, 
                    Descricao = d.Descricao,
                    Categoria = d.Categoria,
                    Tipo = "Saida",
                    Valor = d.Valor,
                    Origem = "Despesa"
                }).ToList(); 

            // Transações Manuais
            var todasTransacoesManuais = await _transacaoRepo.GetAll(); 
            var transacoesManuais = todasTransacoesManuais
                .Where(t => t.Data >= dataInicio && t.Data <= dataFim)
                .Select(t => new TransacaoItemDTO
                {
                    Id = t.Id,
                    Data = t.Data,
                    Descricao = t.Descricao,
                    Categoria = t.Categoria ?? "Geral",
                    Tipo = t.Tipo,
                    Valor = t.Valor,
                    Origem = "Manual"
                }).ToList(); 

            // Consolidação
            var todasTransacoes = boletosPagos.Concat(despesasPagas).Concat(transacoesManuais)
                                              .OrderByDescending(t => t.Data)
                                              .ToList();

            var totalEntradas = todasTransacoes.Where(t => t.Tipo == "Entrada").Sum(t => t.Valor);
            var totalSaidas = todasTransacoes.Where(t => t.Tipo == "Saida").Sum(t => t.Valor);

            return new RelatorioFinanceiroDTO
            {
                TotalEntradas = totalEntradas,
                TotalSaidas = totalSaidas,
                Saldo = totalEntradas - totalSaidas,
                Transacoes = todasTransacoes
            };
        }

        // --- Novos Relatórios (Stubs) ---

        // 1. Adimplentes
        public async Task<List<RelatorioAssociadoDTO>> GerarRelatorioAdimplentes()
        {
            var associados = (await _associadoRepo.GetAll())
                .Where(a => a.Situacao == "Regular") 
                .Select(a => new RelatorioAssociadoDTO 
                { 
                    Id = a.Id, 
                    Nome = a.Nome, 
                    CPF = a.CPF, 
                    Situacao = a.Situacao 
                })
                .ToList();
            return associados;
        }

        // 2. Associados (Versão simples, sem dependentes)
        public async Task<List<RelatorioAssociadoDTO>> GerarRelatorioAssociados()
        {
            var associados = await _associadoRepo.GetAll();
            return associados.Select(a => new RelatorioAssociadoDTO
            {
                Id = a.Id,
                Nome = a.Nome,
                CPF = a.CPF,
                Situacao = a.Situacao
            }).ToList();
        }

        // 4. Dependentes
        public async Task<List<RelatorioDependenteDTO>> GerarRelatorioDependentes()
        {
            var dependentes = await _dependenteRepo.GetAll(); 
            return dependentes.Select(d => new RelatorioDependenteDTO
            {
                Id = d.Id,
                Nome = d.Nome,
                DataNascimento = d.DataNascimento,
                GrauParentesco = d.GrauParentesco,
            }).ToList();
        }

        // 5. Usuários
        public async Task<List<UserDTO>> GerarRelatorioUsuarios()
        {
            var usuarios = await _userRepo.GetAll();
            return usuarios.Select(u => new UserDTO 
            { 
                Nome = u.UserName, 
                Email = u.Email
            }).ToList();
        }

        // 6. Contas a Receber (Boletos pendentes)
        public async Task<List<TransacaoItemDTO>> GerarRelatorioContasAReceber(DateTime dataInicio, DateTime dataFim)
        {
            var boletosPendentes = await _boletoRepo.GetQueryable()
                .Include(b => b.Associado)
                .Where(b => b.Status == BoletoStatus.Pendente && b.DataVencimento >= dataInicio && b.DataVencimento <= dataFim)
                .Select(b => new TransacaoItemDTO
                {
                    Data = b.DataVencimento,
                    Descricao = $"Boleto de {(b.Associado != null ? b.Associado.Nome : "N/A")}",
                    Valor = b.Valor,
                    Tipo = "Entrada",
                    Origem = "Boleto Pendente"
                })
                .ToListAsync();
            return boletosPendentes;
        }

        // 7. Contas a Pagar (Despesas pendentes)
        public async Task<List<TransacaoItemDTO>> GerarRelatorioContasAPagar(DateTime dataInicio, DateTime dataFim)
        {
            var despesasPendentes = (await _despesaRepo.GetAll())
                .Where(d => d.Status == "Pendente" && d.DataVencimento >= dataInicio && d.DataVencimento <= dataFim)
                .Select(d => new TransacaoItemDTO
                {
                    Data = d.DataVencimento, 
                    Descricao = d.Descricao,
                    Categoria = d.Categoria,
                    Tipo = "Saida",
                    Valor = d.Valor,
                    Origem = "Despesa Pendente"
                }).ToList();
            return despesasPendentes;
        }

        // 8. Contas Pagas (Despesas pagas)
        public async Task<List<TransacaoItemDTO>> GerarRelatorioContasPagas(DateTime dataInicio, DateTime dataFim)
        {
            var despesasPagas = (await _despesaRepo.GetAll())
                .Where(d => (d.Status == "Pago" || d.Status == "Pago com atraso") && d.DataPagamento.HasValue && d.DataPagamento.Value >= dataInicio && d.DataPagamento.Value <= dataFim)
                .Select(d => new TransacaoItemDTO
                {
                    Data = d.DataPagamento!.Value, // Adicionado '!'
                    Descricao = d.Descricao,
                    Categoria = d.Categoria,
                    Tipo = "Saida",
                    Valor = d.Valor,
                    Origem = "Despesa Paga"
                }).ToList();
            return despesasPagas;
        }

        // 9. Receitas Arrecadadas (Boletos pagos + Transações 'Entrada')
        public async Task<List<TransacaoItemDTO>> GerarRelatorioReceitasArrecadadas(DateTime dataInicio, DateTime dataFim)
        {
             var boletosPagos = await _boletoRepo.GetQueryable()
                .Include(b => b.Associado)
                .Where(b => b.Status == BoletoStatus.Pago && b.DataPagamento.HasValue && b.DataPagamento.Value >= dataInicio && b.DataPagamento.Value <= dataFim)
                .Select(b => new TransacaoItemDTO
                {
                    Data = b.DataPagamento!.Value, // Adicionado '!'
                    Descricao = $"Boleto de {(b.Associado != null ? b.Associado.Nome : "N/A")}",
                    Valor = b.ValorPago.GetValueOrDefault(),
                    Tipo = "Entrada",
                    Origem = "Boleto"
                })
                .ToListAsync();

            var transacoesEntrada = (await _transacaoRepo.GetAll())
                .Where(t => t.Tipo == "Entrada" && t.Data >= dataInicio && t.Data <= dataFim)
                .Select(t => new TransacaoItemDTO
                {
                    Data = t.Data,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = "Entrada",
                    Origem = "Manual"
                }).ToList();

            return boletosPagos.Concat(transacoesEntrada).OrderBy(t => t.Data).ToList();
        }

        // 10. Contas Recebidas (Similar a Receitas Arrecadadas)
        public async Task<List<TransacaoItemDTO>> GerarRelatorioContasRecebidas(DateTime dataInicio, DateTime dataFim)
        {
            return await GerarRelatorioReceitasArrecadadas(dataInicio, dataFim);
        }

        // 11. Extrato Financeiro (Lista de transações do Fluxo de Caixa)
        public async Task<List<TransacaoItemDTO>> GerarRelatorioExtratoFinanceiro(DateTime dataInicio, DateTime dataFim)
        {
            var relatorio = await GetFluxoDeCaixa(dataInicio, dataFim);
            return relatorio.Transacoes;
        }

        // 12. Fornecedores
        public async Task<List<FornecedorDTO>> GerarRelatorioFornecedores()
        {
            var fornecedores = await _fornecedorRepo.GetAll();
            return fornecedores.Select(f => new FornecedorDTO
            {
                Id = f.Id,
                Nome = f.Nome,
                Cnpj = f.Cnpj, 
                Telefone = f.Telefone,
                Email = f.Email
            }).ToList();
        }

        // 13. Demonstrativo de Arrecadação de Mensalidades (retornar um objeto anônimo ou DTO específico)
        public async Task<object> GerarRelatorioArrecadacaoMensalidades(DateTime dataInicio, DateTime dataFim)
        {
            var boletosPagos = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.Pago && b.DataPagamento.HasValue && b.DataPagamento.Value >= dataInicio && b.DataPagamento.Value <= dataFim)
                .ToListAsync();

            var totalArrecadado = boletosPagos.Sum(b => b.ValorPago.GetValueOrDefault());
            // CORREÇÃO: Acessar diretamente se JurosMora não for nullable
            // Se JurosMora for decimal? use GetValueOrDefault(), senão use direto
             var totalJuros = boletosPagos.Sum(b => b.JurosMora); // Supondo que JurosMora é decimal
            // Se JurosMora for decimal?, use:
            // var totalJuros = boletosPagos.Sum(b => b.JurosMora.GetValueOrDefault());
            
            return new 
            {
                Periodo = $"{dataInicio:dd/MM/yyyy} a {dataFim:dd/MM/yyyy}",
                TotalArrecadado = totalArrecadado,
                TotalPrincipal = totalArrecadado - totalJuros,
                TotalJuros = totalJuros,
                QuantidadeBoletosPagos = boletosPagos.Count
            };
        }

        // 14. Movimento Diário
        public async Task<RelatorioFinanceiroDTO> GerarRelatorioMovimentoDiario(DateTime data)
        {
            return await GetFluxoDeCaixa(data.Date, data.Date.AddDays(1).AddTicks(-1));
        }

        // 15. Despesas por Data de Emissão
        public async Task<List<TransacaoItemDTO>> GerarRelatorioDespesasPorEmissao(DateTime dataInicio, DateTime dataFim)
        {
            var despesas = (await _despesaRepo.GetAll())
                .Where(d => d.DataVencimento >= dataInicio && d.DataVencimento <= dataFim)
                .OrderBy(d => d.DataVencimento)
                .Select(d => new TransacaoItemDTO
                {
                    Data = d.DataVencimento, 
                    Descricao = d.Descricao,
                    Categoria = d.Categoria,
                    Tipo = "Saida",
                    Valor = d.Valor,
                    Origem = $"Despesa ({d.Status})"
                }).ToList();
            return despesas;
        }

        // 16. Receitas Mensais (Agrupado)
        public async Task<object> GerarRelatorioReceitasMensais(int ano)
        {
            var boletos = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.Pago && b.DataPagamento.HasValue && b.DataPagamento.Value.Year == ano)
                .ToListAsync();
            
            var transacoes = (await _transacaoRepo.GetAll())
                .Where(t => t.Tipo == "Entrada" && t.Data.Year == ano)
                .ToList();

            var receitas = boletos.Select(b => new { Data = b.DataPagamento!.Value, Valor = b.ValorPago.GetValueOrDefault() }) // Adicionado '!'
                                .Concat(transacoes.Select(t => new { Data = t.Data, Valor = t.Valor }));

            var relatorioMensal = receitas
                .GroupBy(r => r.Data.Month)
                .Select(g => new
                {
                    Mes = g.Key,
                    Total = g.Sum(r => r.Valor)
                })
                .OrderBy(r => r.Mes)
                .ToList();
                
            return relatorioMensal;
        }

        // 17. Resumo Financeiro (Fluxo de Caixa sem a lista detalhada)
        public async Task<RelatorioFinanceiroDTO> GerarRelatorioResumoFinanceiro(DateTime dataInicio, DateTime dataFim)
        {
            var relatorio = await GetFluxoDeCaixa(dataInicio, dataFim);
            relatorio.Transacoes = new List<TransacaoItemDTO>(); 
            return relatorio;
        }

        // 18. Relação de Inadimplentes
        public async Task<List<RelatorioAssociadoDTO>> GerarRelatorioInadimplentes()
        {
            var associadosInadimplentesIds = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.Pendente && b.DataVencimento < DateTime.Now)
                .Select(b => b.AssociadoId)
                .Distinct()
                .ToListAsync();
            
            var associados = (await _associadoRepo.GetAll())
                .Where(a => associadosInadimplentesIds.Contains(a.Id) || a.Situacao == "Inadimplente")
                 .Select(a => new RelatorioAssociadoDTO
                 {
                     Id = a.Id,
                     Nome = a.Nome,
                     CPF = a.CPF,
                     Situacao = a.Situacao
                 })
                .ToList();
            
            return associados;
        }

        // 19. Previsão de Receitas e Despesas
        public async Task<object> GerarRelatorioPrevisao(DateTime dataInicio, DateTime dataFim)
        {
            // Receitas (Boletos pendentes)
            // 1. Trazer os boletos para a memória antes de somar
            var boletosPendentes = await _boletoRepo.GetQueryable()
                .Where(b => b.Status == BoletoStatus.Pendente && b.DataVencimento >= dataInicio && b.DataVencimento <= dataFim)
                .Select(b => b.Valor) // Seleciona apenas o valor necessário
                .ToListAsync(); // Traz para a memória

            // 2. Somar em memória usando LINQ to Objects
            var previsaoReceitas = boletosPendentes.Sum(); 
            
            // Despesas (Despesas pendentes) - Já estava sendo feito em memória
            var despesas = await _despesaRepo.GetAll(); 
            var previsaoDespesas = despesas
                .Where(d => d.Status == "Pendente" && d.DataVencimento >= dataInicio && d.DataVencimento <= dataFim)
                .Sum(d => d.Valor);
            
            return new 
            {
                Periodo = $"{dataInicio:dd/MM/yyyy} a {dataFim:dd/MM/yyyy}",
                TotalPrevistoReceitas = previsaoReceitas,
                TotalPrevistoDespesas = previsaoDespesas,
                SaldoPrevisto = previsaoReceitas - previsaoDespesas
            };
        }

    }
}
