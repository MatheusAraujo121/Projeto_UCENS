using Application.Features.Financeiro;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// REMOVA: using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransacaoController : ControllerBase
    {
        // REMOVA: private readonly AppDbContext _context;
        private readonly TransacaoService _transacaoService; // Injeta o serviço

        public TransacaoController(TransacaoService transacaoService) // Atualiza o construtor
        {
            _transacaoService = transacaoService;
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> AddTransacao(TransacaoManualDTO dto)
        {
            try
            {
                var transacao = await _transacaoService.AddTransacaoAsync(dto);
                return CreatedAtAction(nameof(GetTransacaoById), new { id = transacao.Id }, transacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception) // Captura outras exceções genéricas
            {
                return StatusCode(500, "Ocorreu um erro interno ao adicionar a transação.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transacao>> GetTransacaoById(int id)
        {
            var transacao = await _transacaoService.GetTransacaoByIdAsync(id);
            if (transacao == null) return NotFound();
            return transacao;
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(int id)
        {
            var success = await _transacaoService.DeleteTransacaoAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}