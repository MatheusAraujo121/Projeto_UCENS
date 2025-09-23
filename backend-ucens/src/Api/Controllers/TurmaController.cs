using Application.Features.Turmas;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TurmaController : ControllerBase
    {
        private readonly TurmaService _service;

        public TurmaController(TurmaService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TurmaDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<TurmaDTO>> GetById(int id)
        {
            var turma = await _service.GetById(id);
            return turma == null ? NotFound() : Ok(turma);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Turma>> Create([FromBody] TurmaDTO dto)
        {
            try
            {
                var created = await _service.Add(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.Delete(id);
                return NoContent(); 
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message }); 
            }
        }

        [HttpPost("matricular-associado")]
        [Authorize]
        public async Task<IActionResult> MatricularAssociado([FromBody] MatriculaDTO dto)
        {
            await _service.MatricularAssociado(dto);
            return Ok("Associado matriculado com sucesso.");
        }

        [HttpPost("matricular-dependente")]
        [Authorize]
        public async Task<IActionResult> MatricularDependente([FromBody] MatriculaDTO dto)
        {
            await _service.MatricularDependente(dto);
            return Ok("Dependente matriculado com sucesso.");
        }

        [HttpDelete("desmatricular-associado")]
        [Authorize]
        public async Task<IActionResult> DesmatricularAssociado([FromBody] MatriculaDTO dto)
        {
            try
            {
                await _service.DesmatricularAssociado(dto);
                return Ok("Associado desmatriculado com sucesso.");
            }
            catch(System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("desmatricular-dependente")]
        [Authorize]
        public async Task<IActionResult> DesmatricularDependente([FromBody] MatriculaDTO dto)
        {
             try
            {
                await _service.DesmatricularDependente(dto);
                return Ok("Dependente desmatriculado com sucesso.");
            }
            catch(System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}