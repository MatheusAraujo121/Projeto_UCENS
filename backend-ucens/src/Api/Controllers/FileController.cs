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
        // Adicionado "despesas" à lista de tipos permitidos
        private readonly string[] _allowedUploadTypes = { "activities", "events", "despesas" };

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
                // Define a pasta raiz com base no tipo de upload
                string rootFolderName;
                string specificFolderPath;

                if (type.Equals("despesas", StringComparison.OrdinalIgnoreCase))
                {
                    rootFolderName = "files"; // Pasta para anexos de despesas
                    specificFolderPath = Path.Combine(_env.WebRootPath, rootFolderName, type.ToLower());
                }
                else
                {
                    rootFolderName = "images"; // Pasta original para imagens
                    specificFolderPath = Path.Combine(_env.WebRootPath, rootFolderName, type.ToLower());
                }
                
                if (!Directory.Exists(specificFolderPath))
                {
                    Directory.CreateDirectory(specificFolderPath);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(specificFolderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Gera a URL correta com base na pasta raiz
                var fileUrl = $"{Request.Scheme}://{Request.Host}/{rootFolderName}/{type.ToLower()}/{uniqueFileName}";

                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno do servidor ao fazer upload: {ex.Message}" });
            }
        }
    }
}