using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Eventos
{
    public class EventoService
    {
        private readonly IRepository<Evento> _repo;
        private readonly IImageKitService _imageKitService;

        public EventoService(IRepository<Evento> repo, IImageKitService imageKitService) 
        {
            _repo = repo;
            _imageKitService = imageKitService;
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
            var evento = MapToEntity(dto);
            await _repo.Add(evento);
            dto.Id = evento.Id;
            return dto;
        }

        public async Task<EventoDTO> Update(int id, EventoDTO dto)
        {
            var evento = await _repo.GetById(id);
            if (evento == null)
            {
                throw new System.Exception($"Evento com ID {id} não encontrado.");
            }

            string? oldFileId = evento.ImagemFileId;

            MapDtoToEntity(dto, evento);

            await _repo.Update(evento);

            if (!string.IsNullOrEmpty(oldFileId) && oldFileId != evento.ImagemFileId)
            {
                await _imageKitService.DeleteAsync(oldFileId);
            }

            return MapToDto(evento);
        }

        public async Task Delete(int id)
        {
            var evento = await _repo.GetById(id);
            if (evento == null)
            {
                return;
            }

            string? fileIdToDelete = evento.ImagemFileId; 

            await _repo.Delete(id);

            if (!string.IsNullOrEmpty(fileIdToDelete))
            {
                await _imageKitService.DeleteAsync(fileIdToDelete);
            }
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
                ImagemUrl = evento.ImagemUrl,
                ImagemFileId = evento.ImagemFileId 
            };
        }

        private static Evento MapToEntity(EventoDTO dto)
        {
            return new Evento
            {
                Id = dto.Id,
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Local = dto.Local,
                Inicio = dto.Inicio,
                Fim = dto.Fim,
                ImagemUrl = dto.ImagemUrl,
                ImagemFileId = dto.ImagemFileId 
            };
        }

        private static void MapDtoToEntity(EventoDTO dto, Evento evento)
        {
            evento.Nome = dto.Nome;
            evento.Descricao = dto.Descricao;
            evento.Local = dto.Local;
            evento.Inicio = dto.Inicio;
            evento.Fim = dto.Fim;
            evento.ImagemUrl = dto.ImagemUrl;
            evento.ImagemFileId = dto.ImagemFileId; 
        }
    }
}