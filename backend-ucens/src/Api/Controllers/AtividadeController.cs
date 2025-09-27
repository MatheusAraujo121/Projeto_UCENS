using Application.Features.Atividades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtividadeController : ControllerBase
    {
        private readonly AtividadeService _service;
        private readonly IWebHostEnvironment _env; 

        public AtividadeController(AtividadeService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AtividadeDTO>>> GetAll()
        {
            var atividades = await _service.GetAll();
            return Ok(atividades);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<AtividadeDTO>> GetById(int id)
        {
            var atividade = await _service.GetById(id);
            return atividade == null ? NotFound() : Ok(atividade);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AtividadeDTO>> Create([FromBody] AtividadeDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<AtividadeDTO>> Update(int id, [FromBody] AtividadeDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                var updated = await _service.Update(id, _env.WebRootPath, dto);
                return Ok(updated);
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id, _env.WebRootPath);
            return NoContent();
        }
    }
}