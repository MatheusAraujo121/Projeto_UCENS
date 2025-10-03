using Microsoft.AspNetCore.Mvc;
using System;
using System.Text;
using System.Threading.Tasks;
using Application.Features.Financeiro;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

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
        public async Task<IActionResult> GerarRemessa([FromBody] List<BoletoParaGeracaoDto> boletos)
        {
            try
            {
                var resultado = await _financeiroService.GerarArquivoRemessa(boletos);

                if (string.IsNullOrEmpty(resultado.ConteudoArquivo))
                {
                    return NoContent(); // Retorna 204 se nenhum boleto foi gerado
                }

                var bytesArquivo = Encoding.UTF8.GetBytes(resultado.ConteudoArquivo);
                var nomeArquivo = resultado.NomeArquivo;

                return File(bytesArquivo, "text/plain", nomeArquivo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao gerar arquivo de remessa: {ex.Message}");
            }
        }
    }
}