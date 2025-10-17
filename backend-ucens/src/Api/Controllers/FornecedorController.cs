using Application.Features.Fornecedores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FornecedorController : ControllerBase
    {
        private readonly FornecedorService _service;

        public FornecedorController(FornecedorService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FornecedorDTO>>> GetAll()
        {
            var fornecedores = await _service.GetAll();
            return Ok(fornecedores);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<FornecedorDTO>> GetById(int id)
        {
            var fornecedor = await _service.GetById(id);
            return fornecedor == null ? NotFound() : Ok(fornecedor);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FornecedorDTO>> Create([FromBody] FornecedorDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<FornecedorDTO>> Update(int id, [FromBody] FornecedorDTO dto)
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
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return NoContent();
        }
        
        // Endpoints para Despesas
        [HttpPost("{fornecedorId:int}/despesas")]
        [Authorize]
        public async Task<ActionResult<DespesaDTO>> AddDespesa(int fornecedorId, [FromBody] DespesaDTO dto)
        {
            if (fornecedorId != dto.FornecedorId)
            {
                return BadRequest("O ID do fornecedor na URL não corresponde ao ID no corpo da requisição.");
            }
            var created = await _service.AddDespesa(dto);
            return Ok(created);
        }

        [HttpPut("despesas/{id:int}")]
        [Authorize]
        public async Task<ActionResult<DespesaDTO>> UpdateDespesa(int id, [FromBody] DespesaDTO dto)
        {
             if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                var updated = await _service.UpdateDespesa(id, dto);
                return Ok(updated);
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        
        [HttpDelete("despesas/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteDespesa(int id)
        {
            await _service.DeleteDespesa(id);
            return NoContent();
        }
    }
}