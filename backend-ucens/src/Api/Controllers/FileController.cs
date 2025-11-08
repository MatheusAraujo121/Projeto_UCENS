using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet; // (Ignore o erro vermelho)
using CloudinaryDotNet.Actions; // (Ignore o erro vermelho)
using System;
using System.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        private readonly string[] _allowedUploadTypes = { "activities", "events", "despesas" }; // Carousel é tratado no seu próprio controller

        // Injete o Cloudinary
        public FileController(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
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
                // 1. Upload direto para o Cloudinary
                await using var stream = file.OpenReadStream();
                
                UploadParams uploadParams;

                // Para "despesas", permita outros tipos de arquivo (Raw)
                if (type.Equals("despesas", StringComparison.OrdinalIgnoreCase))
                {
                    uploadParams = new RawUploadParams()
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = type.ToLower()
                    };
                }
                else // Para 'activities' e 'events', use ImageUpload
                {
                    uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = type.ToLower() 
                    };
                }
                
                // 2. Faz o upload
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    return StatusCode(500, new { message = $"Erro no upload: {uploadResult.Error.Message}" });
                }

                // 3. Pega a URL segura (https)
                var fileUrl = uploadResult.SecureUrl.AbsoluteUri;

                // 4. Retorna a URL para o frontend
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
            }
        }
    }
}