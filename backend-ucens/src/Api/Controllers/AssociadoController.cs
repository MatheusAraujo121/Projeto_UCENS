using Application.Features.Associados;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssociadoController : ControllerBase
    {
        private readonly AssociadoService _service;

        public AssociadoController(AssociadoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssociadoDto>>> GetAll()
        {
            var associados = await _service.GetAll();
            return Ok(associados);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<AssociadoDto?>> GetById(int id)
        {
            var associado = await _service.GetById(id);
            return associado is null ? NotFound() : Ok(associado);
        }

        [HttpPost]
        public async Task<ActionResult<AssociadoDto>> Create([FromBody] AssociadoDto dto)
        {
            if (dto == null)
            {
                return BadRequest("O corpo da requisição não pode ser nulo.");
            }
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<AssociadoDto>> Update(int id, [FromBody] AssociadoDto dto)
        {
            if (id != dto.Id)
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");

            var updated = await _service.Update(dto);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return NoContent();
        }
    }
}