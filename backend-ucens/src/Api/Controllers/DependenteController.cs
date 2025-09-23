using Application.Features.Associados;
using Domain;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DependentesController : ControllerBase
    {
        private readonly DependentesService _service;

        public DependentesController(DependentesService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Dependente>>> GetAll()
            => Ok(await _service.GetAll());

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<Dependente?>> GetById(int id)
        {
            var d = await _service.GetById(id);
            return d is null ? NotFound() : Ok(d);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Dependente>> Create([FromBody] DependentesDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<Dependente>> Update(int id, [FromBody] DependentesDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }
            var updated = await _service.Update(id, dto);
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