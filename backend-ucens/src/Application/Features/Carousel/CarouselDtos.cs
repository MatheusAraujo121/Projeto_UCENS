using System.ComponentModel.DataAnnotations;

namespace Application.Features.Carousel
{
    public class CarouselImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class CreateCarouselImageDto
    {
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

    }
}