using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Features.Financeiro;
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

        [HttpGet("historico/{associadoId}")]
        [Authorize]
        public async Task<IActionResult> GetHistorico(int associadoId)
        {
            var historico = await _financeiroService.GetHistoricoBoletosPorAssociadoAsync(associadoId);
            return Ok(historico);
        }

        // ENDPOINT PARA BUSCAR UM BOLETO ESPECÍFICO POR ID
        [HttpGet("boleto/{boletoId}")]
        [Authorize]
        public async Task<IActionResult> GetBoleto(int boletoId)
        {
            var boleto = await _financeiroService.GetBoletoByIdAsync(boletoId);
            if (boleto == null)
            {
                return NotFound($"Boleto com ID {boletoId} não encontrado.");
            }
            return Ok(boleto);
        }

        [HttpPost("solicitar-cancelamento/{id}")]
        [Authorize]
        public async Task<IActionResult> SolicitarCancelamento(int id, [FromBody] SolicitarCancelamentoDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var sucesso = await _financeiroService.SolicitarCancelamentoBoletoAsync(id, dto.Motivo);
            if (!sucesso)
            {
                return NotFound(new { message = $"Boleto com ID {id} não encontrado ou não pode ser cancelado." });
            }
            return Ok(new { message = $"Solicitação de cancelamento para o boleto {id} registrada." });
        }

        [HttpPost("gerar-remessa")]
        [Authorize]
        public async Task<IActionResult> GerarRemessa([FromBody] List<BoletoParaGeracaoDto> boletosParaGerar)
        {
            try
            {
                var resultado = await _financeiroService.GerarArquivoRemessaAsync(boletosParaGerar);
                if (resultado.ConteudoArquivo.Length == 0)
                {
                    return NotFound("Nenhum boleto foi gerado.");
                }
                return File(resultado.ConteudoArquivo, "application/octet-stream", resultado.NomeArquivo);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro inesperado.", error = ex.Message });
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

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    await _financeiroService.ProcessarArquivoRetornoAsync(stream);
                }
                return Ok("Arquivo de retorno processado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao processar o arquivo de retorno.", error = ex.Message });
            }
        }
    }
}