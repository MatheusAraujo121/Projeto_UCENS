using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Features.Financeiro;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceiroController : ControllerBase
    {
        private readonly FinanceiroService _financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            _financeiroService = financeiroService;
        }

        [HttpGet("boletos")]
        [Authorize]
        public async Task<IActionResult> GetBoletos()
        {
            var boletos = await _financeiroService.GetBoletosAsync();
            return Ok(boletos);
        }

        // --- NOVO ENDPOINT ADICIONADO ---
        [HttpPost("solicitar-cancelamento/{id}")]
        [Authorize]
        public async Task<IActionResult> SolicitarCancelamento(int id, [FromBody] SolicitarCancelamentoDto dto)
        {
            // O [FromBody] faz com que o `dto` seja populado com o JSON enviado na requisição
            // A validação do DTO (Required, MinLength) é feita automaticamente pelo ASP.NET Core
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sucesso = await _financeiroService.SolicitarCancelamentoBoletoAsync(id, dto.Motivo);
            if (!sucesso)
            {
                return NotFound(new { message = $"Boleto com ID {id} não encontrado ou não pode ser cancelado (status inválido)." });
            }
            return Ok(new { message = $"Solicitação de cancelamento para o boleto {id} registrada com sucesso." });
        }

        [HttpPost("gerar-remessa")]
        [Authorize]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 500)]
        public async Task<IActionResult> GerarRemessa([FromBody] List<BoletoParaGeracaoDto> boletosParaGerar)
        {
            try
            {
                var resultado = await _financeiroService.GerarArquivoRemessaAsync(boletosParaGerar);

                if (resultado.ConteudoArquivo.Length == 0)
                {
                    return NotFound("Nenhum boleto foi gerado para a solicitação.");
                }
                return File(resultado.ConteudoArquivo, "application/octet-stream", resultado.NomeArquivo);
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro inesperado ao gerar o arquivo de remessa.", error = ex.Message });
            }
        }

        [HttpPost("importar-retorno")]
        [Authorize]
        public async Task<IActionResult> ImportarRetorno(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nenhum arquivo foi enviado.");
            }

            using (var stream = file.OpenReadStream())
            {
                await _financeiroService.ProcessarArquivoRetornoAsync(stream);
            }
            return Ok("Arquivo de retorno processado com sucesso.");
        }
    }
}