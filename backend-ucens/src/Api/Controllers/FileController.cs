using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        // Lista de tipos de upload permitidos para segurança
        private readonly string[] _allowedUploadTypes = { "activities", "events" };

        public FileController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string type)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Nenhum arquivo foi enviado." });

            if (string.IsNullOrEmpty(type) || !Array.Exists(_allowedUploadTypes, t => t.Equals(type, StringComparison.OrdinalIgnoreCase)))
                return BadRequest(new { message = "Tipo de upload inválido ou não especificado." });

            try
            {
                // Define a pasta de destino com base no tipo (ex: 'images/activities')
                var uploadsFolderPath = Path.Combine(_env.WebRootPath, "images", type.ToLower());

                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"{Request.Scheme}://{Request.Host}/images/{type.ToLower()}/{uniqueFileName}";

                return Ok(new { url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno do servidor ao fazer upload: {ex.Message}" });
            }
        }
    }
}