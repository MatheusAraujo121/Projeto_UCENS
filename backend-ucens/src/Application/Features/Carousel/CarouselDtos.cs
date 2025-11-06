using System.ComponentModel.DataAnnotations;

namespace Application.Features.Carousel
{
    // O que vamos enviar PARA o Angular
    public class CarouselImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    // O que vamos receber DO Angular ao criar
    public class CreateCarouselImageDto
    {
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

    }
}