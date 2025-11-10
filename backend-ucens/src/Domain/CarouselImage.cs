using System;
using System.ComponentModel.DataAnnotations;
public class CarouselImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    //Id retornado pelo imagekit
    public string? ImagemFileId { get; set; }
}