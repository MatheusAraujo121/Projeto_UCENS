using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting; 
using Microsoft.AspNetCore.Authorization;
using Application.Common.Interfaces; 

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IImageKitService _imageKitService;
        private readonly string[] _allowedUploadTypes = { "activities", "events", "despesas", "carousel" };

        public FileController(IImageKitService imageKitService)
        {
            _imageKitService = imageKitService;
        }

        [HttpPost("upload")]
        [Authorize]
        [Consumes("multipart/form-data")] 
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string type)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Nenhum arquivo foi enviado." });

            if (string.IsNullOrEmpty(type) || !_allowedUploadTypes.Contains(type, StringComparer.OrdinalIgnoreCase))
                return BadRequest(new { message = "Tipo de upload inválido ou não especificado." });

            try
            {
                string folder = $"/{type.ToLower()}";
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";

                var (url, fileId) = await _imageKitService.UploadAsync(file, uniqueFileName, folder);

                return Ok(new { url = url, fileId = fileId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno do servidor ao fazer upload: {ex.Message}" });
            }
        }
    }
}