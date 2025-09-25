using Application.Features.Contato;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContatoController : ControllerBase
    {
        private readonly EmailService _service;

        public ContatoController(EmailService service)
        {
            _service = service;
        }

        [HttpPost("enviar")]
        public async Task<IActionResult> EnviarMensagem([FromBody] ContatoDTO dto)
        {
            try
            {
                await _service.EnviarEmailContato(dto);
                return Ok(new { message = "Sua mensagem foi enviada com sucesso!" });
            }
            catch (Exception)
            {
                return StatusCode(500, new 
                { 
                    message = "Ocorreu um erro detalhado ao enviar o e-mail.",
                });
            }
        }
    }
}