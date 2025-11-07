// Application/Features/Carousel/CarouselService.cs
using Application.Common.Interfaces;
using Application.Features.Carousel;
using Domain;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _env;

        // Define o caminho da subpasta, assim como em AtividadeService
        private const string ImageSubfolder = "images/carousel";

        public CarouselService(IRepository<CarouselImage> repo, IWebHostEnvironment env)
        {
            _repo = repo;
            _env = env;
        }

        // --- GET: Listar todas as imagens ---
        public async Task<List<CarouselImageDto>> GetAllAsync()
        {
            var images = await _repo.GetAll(); 
            
            return images.Select(img => new CarouselImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList();
        }

        // --- POST: Upload de Novas Imagens ---
        public async Task<List<CarouselImageDto>> UploadImagesAsync(List<IFormFile> files, HttpRequest request)
        {
            if (files == null || files.Count == 0)
                throw new Exception("Nenhum arquivo foi enviado.");

            // Usa a constante para o caminho, assim como o AtividadeService faria
            var uploadsFolderPath = Path.Combine(_env.WebRootPath, ImageSubfolder);
            Directory.CreateDirectory(uploadsFolderPath); // Garante que existe

            var newEntities = new List<CarouselImage>();

            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                // 1. Salva arquivo no disco
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var physicalPath = Path.Combine(uploadsFolderPath, uniqueFileName);

                await using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                
                // --- CORREÇÃO DO BUG ---
                // O backendHost já contém "http://", então não precisamos do request.Scheme
                var backendHost = "https://nippon-api.onrender.com"; 
                
                // 2. Cria URL pública
                // Note que o caminho da URL usa / (barra normal), e não o Path.Combine
                var imageUrl = $"{backendHost}/{ImageSubfolder}/{uniqueFileName}";

                // 3. Cria entidade
                var newImage = new CarouselImage { ImageUrl = imageUrl };
                
                await _repo.Add(newImage); 
                newEntities.Add(newImage); 
            }

            // 4. Salva TUDO no banco
            await _repo.SaveChangesAsync();

            // 5. Retorna os DTOs
            return newEntities.Select(img => new CarouselImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList();
        }

        // --- DELETE: Deletar uma imagem ---
        public async Task DeleteAsync(int id)
        {
            var image = await _repo.GetById(id);
            if (image == null)
            {
                return; 
            }

            // 2. Lógica de deletar o arquivo físico
            if (!string.IsNullOrEmpty(image.ImageUrl))
            {
                try
                {
                    // Lógica *exatamente* como AtividadeService (mas sem passar o webRootPath)
                    var fileName = Path.GetFileName(new Uri(image.ImageUrl).AbsolutePath);
                    var physicalPath = Path.Combine(_env.WebRootPath, ImageSubfolder, fileName);

                    if (File.Exists(physicalPath))
                    {
                        File.Delete(physicalPath);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao deletar arquivo físico: {ex.Message}");
                }
            }

            // 3. Deleta do banco
            await _repo.Delete(id); 

            // 4. Salva a mudança no banco
            await _repo.SaveChangesAsync();
        }
    }
}