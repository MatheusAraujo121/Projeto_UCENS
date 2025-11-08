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

        // Removida a injeção de IWebHostEnvironment
        public EventoService(IRepository<Evento> repo)
        {
            _repo = repo;
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
                ImagemUrl = dto.ImagemUrl
            };

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

            evento.Nome = dto.Nome;
            evento.Descricao = dto.Descricao;
            evento.Local = dto.Local;
            evento.Inicio = dto.Inicio;
            evento.Fim = dto.Fim;
            evento.ImagemUrl = dto.ImagemUrl;

            await _repo.Update(evento);
            return MapToDto(evento);
        }

        // Método Delete agora só deleta do banco, sem lógica de arquivo.
        public async Task Delete(int id)
        {
            await _repo.Delete(id);
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