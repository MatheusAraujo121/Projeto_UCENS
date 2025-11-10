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
        private readonly IImageKitService _imageKitService; // <-- Adicionado
        
        // Removido IWebHostEnvironment e _env
        public CarouselService(IRepository<CarouselImage> repo, IImageKitService imageKitService)
        {
            _repo = repo;
            _imageKitService = imageKitService; // <-- Injetado
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
        // Removido HttpRequest request, pois não é mais necessário
        public async Task<List<CarouselImageDto>> UploadImagesAsync(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                throw new Exception("Nenhum arquivo foi enviado.");

            var newEntities = new List<CarouselImage>();

            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                // 1. Gera nome e faz upload no ImageKit
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var (url, fileId) = await _imageKitService.UploadAsync(file, uniqueFileName, "/carousel");

                // 2. Cria entidade com Url e FileId
                var newImage = new CarouselImage 
                { 
                    ImageUrl = url,
                    ImagemFileId = fileId // <-- Salva o FileId no Domínio
                };
                
                await _repo.Add(newImage); 
                newEntities.Add(newImage); 
            }

            // 3. Salva TUDO no banco
            await _repo.SaveChangesAsync();

            // 4. Retorna os DTOs (sem o fileId)
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

            // Pega o FileId *antes* de deletar do banco
            string? fileIdToDelete = image.ImagemFileId;

            // 1. Deleta do banco
            await _repo.Delete(id); 

            // 2. Salva a mudança no banco
            await _repo.SaveChangesAsync();

            // 3. Deleta do ImageKit (APÓS deletar do banco)
            if (!string.IsNullOrEmpty(fileIdToDelete))
            {
                await _imageKitService.DeleteAsync(fileIdToDelete);
            }
        }
    }
}