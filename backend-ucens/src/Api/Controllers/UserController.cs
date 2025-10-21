using Application.Features.Usuarios;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get() =>
            Ok(await _service.GetAllUsers());

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _service.GetUser(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserCreateDTO dto)
        {
            var created = await _service.AddUser(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, [FromBody] UserUpdateDTO dto)
        {
            try
            {
                var updatedUser = await _service.UpdateUser(id, dto);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteUser(id);
            return NoContent();
        }

        [HttpPost("login")]
        [EnableRateLimiting("login")] 
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var (token, remainingAttempts) = await _service.Login(dto);

            if (token == null)
            {
                if (remainingAttempts.HasValue && remainingAttempts.Value == 0)
                {
                    // Retorna 429 Too Many Requests se as tentativas se esgotaram
                    return StatusCode(429, new { message = "Muitas tentativas de login. Tente novamente mais tarde." });
                }
                // Retorna 401 Unauthorized com o número de tentativas restantes
                return Unauthorized(new { 
                    message = "Credenciais inválidas", 
                    remainingAttempts = remainingAttempts 
                });
            }

            return Ok(new { token });
        }
    }
}