using Application.Features.Associados;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
//testando workflows
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
        [Authorize]
        public async Task<ActionResult<IEnumerable<AssociadoDto>>> GetAll()
        {
            var associados = await _service.GetAll();
            return Ok(associados);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<AssociadoDto?>> GetById(int id)
        {
            var associado = await _service.GetById(id);
            return associado is null ? NotFound() : Ok(associado);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AssociadoDto>> Create([FromBody] AssociadoDto dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<AssociadoDto>> Update(int id, [FromBody] AssociadoDto dto)
        {
            if (id != dto.Id)
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");

            var updated = await _service.Update(dto);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return NoContent();
        }
    }
}