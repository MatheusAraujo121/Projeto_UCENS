using Microsoft.AspNetCore.Mvc;
using userApi.Application.Services;
using userApi.Domain.Entities;

namespace userApi.API.Controllers
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
        public async Task<ActionResult<IEnumerable<Dependentes>>> GetAll()
            => Ok(await _service.GetAll());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Dependentes?>> GetById(int id)
        {
            var d = await _service.GetById(id);
            return d is null ? NotFound() : Ok(d);
        }

        [HttpPost]
        public async Task<ActionResult<Dependentes>> Create(Dependentes d)
        {
            var created = await _service.Add(d);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Dependentes>> Update(int id, Dependentes d)
        {
            if (id != d.Id) return BadRequest("Id do corpo diferente do caminho.");
            var updated = await _service.Update(d);
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
