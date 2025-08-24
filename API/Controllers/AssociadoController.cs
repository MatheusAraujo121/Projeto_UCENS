using Microsoft.AspNetCore.Mvc;
using userApi.Application.Services;
using userApi.Domain.Entities;

namespace userApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssociadosController : ControllerBase
    {
        private readonly AssociadosService _service;

        public AssociadosController(AssociadosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Associados>>> GetAll()
            => Ok(await _service.GetAll());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Associados?>> GetById(int id)
        {
            var a = await _service.GetById(id);
            return a is null ? NotFound() : Ok(a);
        }

        [HttpPost]
        public async Task<ActionResult<Associados>> Create(Associados a)
        {
            var created = await _service.Add(a);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Associados>> Update(int id, Associados a)
        {
            if (id != a.Id) return BadRequest("Id do corpo diferente do caminho.");
            var updated = await _service.Update(a);
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
