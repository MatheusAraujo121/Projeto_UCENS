using Application.Features.Carousel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarouselController : ControllerBase
    {
        private readonly CarouselService _carouselService;

        public CarouselController(CarouselService carouselService)
        {
            _carouselService = carouselService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var images = await _carouselService.GetAllAsync();
            return Ok(images);
        }

        [HttpPost]
        [Authorize] // Apenas usuários autorizados podem fazer upload
        public async Task<IActionResult> Upload([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("Nenhum arquivo foi enviado.");
            }

            try
            {
                // CORREÇÃO: Removido o argumento 'Request'
                var newImages = await _carouselService.UploadImagesAsync(files);
                return Ok(newImages);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize] // Apenas usuários autorizados podem deletar
        public async Task<IActionResult> Delete(int id)
        {
            await _carouselService.DeleteAsync(id);
            return NoContent();
        }
    }
}