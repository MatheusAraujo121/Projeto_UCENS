using Application.Features.Relatorios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System; // Adicionado para DateTime e Exception
using System.Threading.Tasks; // Adicionado para Task

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatorioController : ControllerBase
    {
        private readonly RelatorioService _relatorioService;

        public RelatorioController(RelatorioService relatorioService)
        {
            _relatorioService = relatorioService;
        }

        // --- Endpoints Existentes ---

        [HttpGet("associados-dependentes")]
        public async Task<IActionResult> GetAssociadosComDependentes()
        {
            try // Adicionando try-catch para robustez
            {
                var relatorio = await _relatorioService.GerarRelatorioAssociadosComDependentes();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        [HttpGet("fluxo-caixa")]
        public async Task<IActionResult> GetFluxoDeCaixa([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GetFluxoDeCaixa(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // --- Novos Endpoints ---

        // 1. Adimplentes
        [HttpGet("adimplentes")]
        public async Task<IActionResult> GetRelatorioAdimplentes()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioAdimplentes();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 2. Associados (Simples)
        [HttpGet("associados")]
        public async Task<IActionResult> GetRelatorioAssociados()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioAssociados();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 4. Dependentes
        [HttpGet("dependentes")]
        public async Task<IActionResult> GetRelatorioDependentes()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioDependentes();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 5. Usuários
        [HttpGet("usuarios")]
        public async Task<IActionResult> GetRelatorioUsuarios()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioUsuarios();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 6. Contas a Receber
        [HttpGet("contas-a-receber")]
        public async Task<IActionResult> GetContasAReceber([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioContasAReceber(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 7. Contas a Pagar
        [HttpGet("contas-a-pagar")]
        public async Task<IActionResult> GetContasAPagar([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioContasAPagar(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 8. Contas Pagas
        [HttpGet("contas-pagas")]
        public async Task<IActionResult> GetContasPagas([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioContasPagas(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 9. Receitas Arrecadadas
        [HttpGet("receitas-arrecadadas")]
        public async Task<IActionResult> GetReceitasArrecadadas([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioReceitasArrecadadas(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 10. Contas Recebidas
        [HttpGet("contas-recebidas")]
        public async Task<IActionResult> GetContasRecebidas([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioContasRecebidas(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 11. Extrato Financeiro
        [HttpGet("extrato-financeiro")]
        public async Task<IActionResult> GetExtratoFinanceiro([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioExtratoFinanceiro(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 12. Fornecedores
        [HttpGet("fornecedores")]
        public async Task<IActionResult> GetRelatorioFornecedores()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioFornecedores();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 13. Demonstrativo de Arrecadação de Mensalidades
        [HttpGet("arrecadacao-mensalidades")]
        public async Task<IActionResult> GetArrecadacaoMensalidades([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioArrecadacaoMensalidades(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 14. Movimento Diário
        [HttpGet("movimento-diario")]
        public async Task<IActionResult> GetMovimentoDiario([FromQuery] DateTime data)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioMovimentoDiario(data);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 15. Despesas por Data de Emissão
        [HttpGet("despesas-por-emissao")]
        public async Task<IActionResult> GetDespesasPorEmissao([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioDespesasPorEmissao(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 16. Receitas Mensais
        [HttpGet("receitas-mensais")]
        public async Task<IActionResult> GetReceitasMensais([FromQuery] int ano)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioReceitasMensais(ano);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 17. Resumo Financeiro
        [HttpGet("resumo-financeiro")]
        public async Task<IActionResult> GetResumoFinanceiro([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioResumoFinanceiro(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 18. Relação de Inadimplentes
        [HttpGet("inadimplentes")]
        public async Task<IActionResult> GetRelatorioInadimplentes()
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioInadimplentes();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

        // 19. Previsão de Receitas e Despesas
        [HttpGet("previsao-financeira")]
        public async Task<IActionResult> GetPrevisaoFinanceira([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await _relatorioService.GerarRelatorioPrevisao(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao gerar relatório: {ex.Message}");
            }
        }

    }
}