using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        private readonly string[] _allowedUploadTypes = { "activities", "events", "despesas" };

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
                await using var stream = file.OpenReadStream();

                // Para "despesas" (ex.: PDF, etc) usamos RawUploadParams
                if (type.Equals("despesas", StringComparison.OrdinalIgnoreCase))
                {
                    var rawParams = new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = type.ToLower()
                    };

                    var uploadResult = await _cloudinary.UploadAsync(rawParams);

                    if (uploadResult.Error != null)
                        return StatusCode(500, new { message = $"Erro no upload: {uploadResult.Error.Message}" });

                    return Ok(new { url = uploadResult.SecureUrl?.AbsoluteUri });
                }
                else // activities/events -> ImageUploadParams
                {
                    var imageParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = type.ToLower()
                    };

                    var uploadResult = await _cloudinary.UploadAsync(imageParams);

                    if (uploadResult.Error != null)
                        return StatusCode(500, new { message = $"Erro no upload: {uploadResult.Error.Message}" });

                    return Ok(new { url = uploadResult.SecureUrl?.AbsoluteUri });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
            }
        }
    }
}
