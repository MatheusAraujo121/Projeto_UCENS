using Microsoft.AspNetCore.Mvc;
using System;
using System.Text;
using System.Threading.Tasks;
using Application.Features.Financeiro;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FinanceiroController : ControllerBase
    {
        private readonly FinanceiroService _financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            _financeiroService = financeiroService;
        }

        [HttpPost("gerar-remessa")]
        public async Task<IActionResult> GerarRemessa([FromBody] GerarRemessaRequest request)
        {
            if (request.AssociadoIds == null || request.AssociadoIds.Length == 0)
            {
                return BadRequest("Selecione ao menos um associado.");
            }

            try
            {
                var conteudoArquivo = await _financeiroService.GerarArquivoRemessa(
                    request.AssociadoIds,
                    request.Valor,
                    request.DataVencimento
                );

                var bytesArquivo = Encoding.UTF8.GetBytes(conteudoArquivo);
                var nomeArquivo = $"REMESSA_{DateTime.Now:yyyyMMdd_HHmmss}.txt";

                return File(bytesArquivo, "text/plain", nomeArquivo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao gerar arquivo de remessa: {ex.Message}");
            }
        }
    }

    public class GerarRemessaRequest
    {
        public int[] AssociadoIds { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
    }
}