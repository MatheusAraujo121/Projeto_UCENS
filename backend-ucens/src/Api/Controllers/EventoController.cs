using Application.Features.Eventos;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly EventoService _service;

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
        public async Task<ActionResult<EventoDTO>> Create([FromBody] EventoDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<EventoDTO>> Update(int id, [FromBody] EventoDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                var updated = await _service.Update(id, dto);
                return Ok(updated);
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return NoContent();
        }
    }
}