using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet; // (Ignore o erro vermelho)
using CloudinaryDotNet.Actions; // (Ignore o erro vermelho)
using System.IO; 

namespace Application.Features.Eventos
{
    public class EventoService
    {
        private readonly IRepository<Evento> _repo;
        private readonly Cloudinary _cloudinary; // <-- Adicionado

        // Injete o Cloudinary
        public EventoService(IRepository<Evento> repo, Cloudinary cloudinary)
        {
            _repo = repo;
            _cloudinary = cloudinary;
        }

        public async Task<List<EventoDTO>> GetAll()
        {
            var eventos = await _repo.GetAll();
            return eventos.Select(e => MapToDto(e)).ToList();
        }

        public async Task<EventoDTO?> GetById(int id)
        {
            var evento = await _repo.GetById(id);
            return evento == null ? null : MapToDto(evento);
        }

        public async Task<EventoDTO> Add(EventoDTO dto)
        {
            var evento = new Evento
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Local = dto.Local,
                Inicio = dto.Inicio,
                Fim = dto.Fim,
                ImagemUrl = dto.ImagemUrl // URL vem do FileController
            };

            await _repo.Add(evento);
            dto.Id = evento.Id;
            return dto;
        }

        // --- MÉTODO UPDATE MODIFICADO ---
        public async Task<EventoDTO> Update(int id, EventoDTO dto)
        {
            var evento = await _repo.GetById(id);
            if (evento == null)
                throw new System.Exception($"Evento com ID {id} não encontrado.");

            // Se a URL da imagem mudou, delete a antiga do Cloudinary
            if (!string.IsNullOrEmpty(evento.ImagemUrl) && evento.ImagemUrl != dto.ImagemUrl)
            {
                try
                {
                    var publicId = GetPublicIdFromUrl(evento.ImagemUrl);
                    if (!string.IsNullOrEmpty(publicId))
                    {
                        var deleteParams = new DeletionParams(publicId);
                        await _cloudinary.DestroyAsync(deleteParams);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao deletar arquivo antigo do Cloudinary: {ex.Message}");
                }
            }

            evento.Nome = dto.Nome;
            evento.Descricao = dto.Descricao;
            evento.Local = dto.Local;
            evento.Inicio = dto.Inicio;
            evento.Fim = dto.Fim;
            evento.ImagemUrl = dto.ImagemUrl; // Salva a nova URL

            await _repo.Update(evento);
            return MapToDto(evento);
        }

        // --- MÉTODO DELETE MODIFICADO ---
        public async Task Delete(int id)
        {
            var evento = await _repo.GetById(id);
            if (evento == null) return;

            // Deleta a imagem do Cloudinary
            if (!string.IsNullOrEmpty(evento.ImagemUrl))
            {
                try
                {
                    var publicId = GetPublicIdFromUrl(evento.ImagemUrl);
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
            
            await _repo.Delete(id);
        }
        
        // Função para extrair o PublicId da URL
        private string GetPublicIdFromUrl(string imageUrl)
        {
             try
            {
                var uri = new Uri(imageUrl);
                string path = string.Join("/", uri.Segments.SkipWhile(s => !s.StartsWith("v") && !s.Contains("upload")).Skip(1));
                return Path.ChangeExtension(path, null); // Retorna "events/nomearquivo"
            }
            catch { return null; }
        }

        private static EventoDTO MapToDto(Evento evento)
        {
            return new EventoDTO
            {
                Id = evento.Id,
                Nome = evento.Nome,
                Descricao = evento.Descricao,
                Local = evento.Local,
                Inicio = DateTime.SpecifyKind(evento.Inicio, DateTimeKind.Utc),
                Fim = DateTime.SpecifyKind(evento.Fim, DateTimeKind.Utc),
                ImagemUrl = evento.ImagemUrl
            };
        }
    }
}