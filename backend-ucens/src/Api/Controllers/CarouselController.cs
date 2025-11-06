// Api/Controllers/CarouselController.cs
using Application.Features.Carousel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // Precisa disso para o 'files' e 'Request'
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarouselController : ControllerBase
    {
        // O Controller agora só conhece o Service
        private readonly CarouselService _service;

        // Injeta o Service, não mais o Repositório ou o Env
        public CarouselController(CarouselService service)
        {
            _service = service;
        }

        // --- GET: Listar todas as imagens ---
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<CarouselImageDto>>> GetCarouselImages()
        {
            // Apenas delega
            var dtos = await _service.GetAllAsync();
            return Ok(dtos);
        }

        // --- POST: Upload de Novas Imagens ---
        [HttpPost("upload")]  // -> /api/carousel/upload
        [Authorize]
        public async Task<ActionResult<List<CarouselImageDto>>> UploadCarouselImages(List<IFormFile> files)
        {
            try
            {
                // Delega, passando os 'files' e o objeto 'Request'
                var savedImages = await _service.UploadImagesAsync(files, Request);
                return Ok(savedImages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- DELETE: Deletar uma imagem ---
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCarouselImage(int id)
        {
            // Apenas delega
            await _service.DeleteAsync(id);
            return NoContent(); // Sucesso
        }
    }
}