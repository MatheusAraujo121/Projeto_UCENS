using Application.Features.Turmas;
using Domain;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<IEnumerable<TurmaDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TurmaDTO>> GetById(int id)
        {
            var turma = await _service.GetById(id);
            return turma == null ? NotFound() : Ok(turma);
        }

        [HttpPost]
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
        
        // --- NOVO ENDPOINT PARA DELETAR TURMA ---
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.Delete(id);
                return NoContent(); // Retorna 204 No Content, que é o padrão para delete com sucesso.
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message }); // Retorna 404 se a turma não for encontrada.
            }
        }

        [HttpPost("matricular-associado")]
        public async Task<IActionResult> MatricularAssociado([FromBody] MatriculaDTO dto)
        {
            await _service.MatricularAssociado(dto);
            return Ok("Associado matriculado com sucesso.");
        }

        [HttpPost("matricular-dependente")]
        public async Task<IActionResult> MatricularDependente([FromBody] MatriculaDTO dto)
        {
            await _service.MatricularDependente(dto);
            return Ok("Dependente matriculado com sucesso.");
        }

        [HttpDelete("desmatricular-associado")]
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