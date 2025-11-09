using Application.Features.Eventos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System; // Mantido para 'Exception'
// Remova os 'using' desnecessários:
// using Microsoft.AspNetCore.Hosting; 
// using System.IO;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly EventoService _service;
        // Removido IWebHostEnvironment _env

        // Removida a injeção de IWebHostEnvironment
        public EventoController(EventoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventoDTO>>> GetAll()
        {
            var eventos = await _service.GetAll();
            return Ok(eventos);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<EventoDTO>> GetById(int id)
        {
            var evento = await _service.GetById(id);
            return evento == null ? NotFound() : Ok(evento);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<EventoDTO>> Create([FromBody] EventoDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EventoDTO>> Update(int id, [FromBody] EventoDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                // CORREÇÃO:
                // A lógica de deletar o arquivo antigo foi removida.
                // O _service.Update(id, dto) agora cuida disso internamente
                // comparando o ImagemFileId antigo com o novo.
                var updated = await _service.Update(id, dto);
                return Ok(updated);
            }
            catch (System.Exception ex)
            {
                // O service lançará uma exceção se não encontrar o evento
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // CORREÇÃO:
                // A lógica de buscar o evento e deletar o arquivo foi removida.
                // O _service.Delete(id) agora cuida de tudo:
                // 1. Encontra o evento.
                // 2. Pega o ImagemFileId.
                // 3. Deleta o evento do banco.
                // 4. Deleta a imagem do ImageKit.
                await _service.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Adicionado um try-catch para segurança
                return NotFound(new { message = ex.Message });
            }
        }
    }
}