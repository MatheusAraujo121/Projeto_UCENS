using Application.Features.Atividades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting; // Remova este 'using' se não for mais usado
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtividadeController : ControllerBase
    {
        private readonly AtividadeService _atividadeService;
        // Remova o _env se não for mais usado para nada
        // private readonly IWebHostEnvironment _env; 

        // Remova IWebHostEnvironment da injeção
        public AtividadeController(AtividadeService atividadeService)
        {
            _atividadeService = atividadeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var atividades = await _atividadeService.GetAll();
            return Ok(atividades);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var atividade = await _atividadeService.GetById(id);
            if (atividade == null)
                return NotFound();
            return Ok(atividade);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] AtividadeDTO dto)
        {
            try
            {
                var novaAtividade = await _atividadeService.Add(dto);
                return CreatedAtAction(nameof(GetById), new { id = novaAtividade.Id }, novaAtividade);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] AtividadeDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID da rota não corresponde ao ID do payload.");
            }

            try
            {
                // CORREÇÃO: Removido o argumento _env.WebRootPath
                var atividadeAtualizada = await _atividadeService.Update(id, dto);
                return Ok(atividadeAtualizada);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // CORREÇÃO: Removido o argumento _env.WebRootPath
                await _atividadeService.Delete(id);
                return NoContent(); // Sucesso, sem conteúdo para retornar
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}