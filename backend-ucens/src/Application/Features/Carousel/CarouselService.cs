using Application.Common.Interfaces;
using Application.Features.Carousel;
using Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Carousel
{
    public class CarouselService
    {
        private readonly IRepository<CarouselImage> _repo;
        private readonly IImageKitService _imageKitService; 
        
        public CarouselService(IRepository<CarouselImage> repo, IImageKitService imageKitService)
        {
            _repo = repo;
            _imageKitService = imageKitService; 
        }

        public async Task<List<CarouselImageDto>> GetAllAsync()
        {
            var images = await _repo.GetAll(); 
            
            return images.Select(img => new CarouselImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList();
        }

        public async Task<List<CarouselImageDto>> UploadImagesAsync(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                throw new Exception("Nenhum arquivo foi enviado.");

            var newEntities = new List<CarouselImage>();
        
            foreach (var file in files)
            {
                if (file.Length == 0) continue;
        
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var (url, fileId) = await _imageKitService.UploadAsync(file, uniqueFileName, "/carousel"); 

                var newImage = new CarouselImage
                {
                    ImageUrl = url,
                    ImagemFileId = fileId 
                };
        
                await _repo.Add(newImage);
                newEntities.Add(newImage);
            }
        
            await _repo.SaveChangesAsync();
        
            return newEntities.Select(img => new CarouselImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList();
        }

        public async Task DeleteAsync(int id)
        {
            var image = await _repo.GetById(id);
            if (image == null)
            {
                return; 
            }

            string? fileIdToDelete = image.ImagemFileId;

            await _repo.Delete(id); 

            await _repo.SaveChangesAsync();

            if (!string.IsNullOrEmpty(fileIdToDelete))
            {
                await _imageKitService.DeleteAsync(fileIdToDelete);
            }
        }
    }
}
