using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet; // (Ignore o erro vermelho)
using CloudinaryDotNet.Actions; // (Ignore o erro vermelho)
using System;

namespace Application.Features.Carousel
{
    public class CarouselService
    {
        private readonly IRepository<CarouselImage> _repo;
        private readonly Cloudinary _cloudinary;

        // Remova IWebHostEnvironment, Injete Cloudinary
        public CarouselService(IRepository<CarouselImage> repo, Cloudinary cloudinary)
        {
            _repo = repo;
            _cloudinary = cloudinary;
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

        // Este método é chamado pelo CarouselController
        public async Task<List<CarouselImageDto>> UploadImagesAsync(List<IFormFile> files, HttpRequest request)
        {
            if (files == null || files.Count == 0)
                throw new Exception("Nenhum arquivo foi enviado.");

            var newEntities = new List<CarouselImage>();

            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                // 1. Upload direto para o Cloudinary
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "carousel" // Pasta "carousel" no Cloudinary
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                    throw new Exception($"Erro no upload: {uploadResult.Error.Message}");
                
                // 2. Pega a URL segura do Cloudinary
                var imageUrl = uploadResult.SecureUrl.AbsoluteUri;

                // 3. Cria a entidade com a URL do Cloudinary
                var newImage = new CarouselImage { ImageUrl = imageUrl };
                
                await _repo.Add(newImage); 
                newEntities.Add(newImage); 
            }

            // 4. Salva TUDO no banco (Neon)
            await _repo.SaveChangesAsync();

            // 5. Retorna os DTOs
            return newEntities.Select(img => new CarouselImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList();
        }

        public async Task DeleteAsync(int id)
        {
            var image = await _repo.GetById(id);
            if (image == null) return;

            // 1. Deleta do Cloudinary
            if (!string.IsNullOrEmpty(image.ImageUrl))
            {
                try
                {
                    var publicId = GetPublicIdFromUrl(image.ImageUrl);
                    if (!string.IsNullOrEmpty(publicId))
                    {
                        var deleteParams = new DeletionParams(publicId);
                        await _cloudinary.DestroyAsync(deleteParams);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao deletar arquivo do Cloudinary: {ex.Message}");
                }
            }

            // 2. Deleta do banco
            await _repo.Delete(id); 
            await _repo.SaveChangesAsync();
        }
        
        // Função para extrair o PublicId da URL
        private string GetPublicIdFromUrl(string imageUrl)
        {
            try
            {
                var uri = new Uri(imageUrl);
                // Pega o caminho depois de ".../upload/v12345/"
                string path = string.Join("/", uri.Segments.SkipWhile(s => !s.StartsWith("v") && !s.Contains("upload")).Skip(1));
                // Remove a extensão (ex: .jpg)
                return Path.ChangeExtension(path, null); // Retorna "carousel/nomearquivo"
            }
            catch 
            { 
                return null; 
            }
        }
    }
}