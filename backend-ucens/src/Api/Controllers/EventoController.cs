using Application.Features.Eventos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly EventoService _service;
        private readonly IWebHostEnvironment _env;

        // Adicionada a injeção de IWebHostEnvironment
        public EventoController(EventoService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
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
        [Authorize]
        public async Task<ActionResult<EventoDTO>> Create([FromBody] EventoDTO dto)
        {
            var created = await _service.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EventoDTO>> Update(int id, [FromBody] EventoDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                // 1. Busca o evento atual para obter a URL da imagem antiga.
                var eventoAtual = await _service.GetById(id);
                if (eventoAtual == null)
                {
                    return NotFound($"Evento com ID {id} não encontrado.");
                }
                var oldImageUrl = eventoAtual.ImagemUrl;

                // 2. Atualiza o evento no banco de dados.
                var updated = await _service.Update(id, dto);

                // 3. Se a URL da imagem mudou e a antiga não era nula, deleta o arquivo antigo.
                if (!string.IsNullOrEmpty(oldImageUrl) && oldImageUrl != updated.ImagemUrl)
                {
                    var fileName = Path.GetFileName(new Uri(oldImageUrl).AbsolutePath);
                    // O caminho para a pasta de eventos
                    var filePath = Path.Combine(_env.WebRootPath, "Images", "Events", fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

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
            // 1. Busca o evento para obter a URL da imagem.
            var evento = await _service.GetById(id);
            if (evento == null)
            {
                return NotFound();
            }

            // 2. Deleta o arquivo de imagem, se existir.
            if (!string.IsNullOrEmpty(evento.ImagemUrl))
            {
                var fileName = Path.GetFileName(new Uri(evento.ImagemUrl).AbsolutePath);
                var filePath = Path.Combine(_env.WebRootPath, "Images", "Events", fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            await _service.Delete(id);
            return NoContent();
        }
    }
}