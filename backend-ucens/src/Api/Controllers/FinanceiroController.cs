using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Features.Financeiro;
using System.Text;

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

        /// <summary>
        /// Gera um arquivo de remessa CNAB400 para o Sicredi com base nos boletos fornecidos.
        /// </summary>
        /// <param name="boletosParaGerar">Lista de boletos a serem incluídos na remessa.</param>
        /// <returns>O arquivo de remessa para download e um resumo dos boletos gerados.</returns>
        [HttpPost("gerar-remessa")]
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

                // Para permitir que o front-end baixe o arquivo e também receba o JSON com os detalhes,
                // retornamos o arquivo como 'multipart/form-data'.
                // Uma alternativa seria retornar o JSON com o arquivo em Base64, mas o download direto é mais eficiente.
                
                // Opção 1: Retornar o arquivo diretamente para download
                return File(resultado.ConteudoArquivo, "application/octet-stream", resultado.NomeArquivo);

                // Opção 2: Se precisar retornar o JSON junto, a abordagem seria diferente.
                // Ex: Retornar um JSON com o arquivo em base64 ou usar uma resposta multipart.
                // Para este exemplo, o download direto é mais prático.
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (System.Exception ex)
            {
                // Log a exceção (ex.InnerException) para depuração
                return StatusCode(500, new { message = "Ocorreu um erro inesperado ao gerar o arquivo de remessa.", error = ex.Message });
            }
        }
    }
}