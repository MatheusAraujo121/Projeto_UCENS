using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Atividades
{
    public class AtividadeService
    {
        private readonly IRepository<Atividade> _repo;
        private readonly IImageKitService _imageKitService; 

        public AtividadeService(IRepository<Atividade> repo, IImageKitService imageKitService) 
        {
            _repo = repo;
            _imageKitService = imageKitService;
        }

        public async Task<List<AtividadeDTO>> GetAll()
        {
            var atividades = await _repo.GetAll();
            return atividades.Select(a => MapToDto(a)).ToList();
        }

        public async Task<AtividadeDTO?> GetById(int id)
        {
            var atividade = await _repo.GetById(id);
            return atividade == null ? null : MapToDto(atividade);
        }

        public async Task<AtividadeDTO> Add(AtividadeDTO dto)
        {
            var atividade = MapToEntity(dto);
            await _repo.Add(atividade);
            
            return MapToDto(atividade);
        }

        public async Task<AtividadeDTO> Update(int id, AtividadeDTO dto)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                throw new Exception($"Atividade com ID {id} não encontrada.");
            }
            
            string? oldFileId = atividade.ImagemFileId; 

            MapDtoToEntity(dto, atividade);

            await _repo.Update(atividade);

            if (!string.IsNullOrEmpty(oldFileId) && oldFileId != atividade.ImagemFileId)
            {
                await _imageKitService.DeleteAsync(oldFileId);
            }
            
            return MapToDto(atividade);
        }

        public async Task Delete(int id)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                return;
            }

            string? fileIdToDelete = atividade.ImagemFileId; 

            await _repo.Delete(id); 

            if (!string.IsNullOrEmpty(fileIdToDelete))
            {
                await _imageKitService.DeleteAsync(fileIdToDelete);
            }
        }

        private static AtividadeDTO MapToDto(Atividade atividade)
        {
            return new AtividadeDTO
            {
                Id = atividade.Id,
                Codigo = atividade.Codigo,
                Nome = atividade.Nome,
                Descricao = atividade.Descricao,
                ImagemUrl = atividade.ImagemUrl,
                ImagemFileId = atividade.ImagemFileId, 
                ExigePiscina = atividade.ExigePiscina,
                ExigeFisico = atividade.ExigeFisico,
                Categoria = atividade.Categoria,
                DiasDisponiveis = atividade.DiasDisponiveis?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>(),
                HorarioSugerido = atividade.HorarioSugerido?.ToString(@"hh\:mm"),
                IdadeMinima = atividade.IdadeMinima,
                IdadeMaxima = atividade.IdadeMaxima,
                LimiteParticipantes = atividade.LimiteParticipantes,
                Local = atividade.Local?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>(),
                ProfessorResponsavel = atividade.ProfessorResponsavel,
                Acontecimentos = atividade.Acontecimentos
            };
        }

        private static Atividade MapToEntity(AtividadeDTO dto)
        {
            return new Atividade
            {
                Id = dto.Id,
                Codigo = dto.Codigo,
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                ImagemUrl = dto.ImagemUrl,
                ImagemFileId = dto.ImagemFileId, 
                ExigePiscina = dto.ExigePiscina,
                ExigeFisico = dto.ExigeFisico,
                Categoria = dto.Categoria,
                DiasDisponiveis = string.Join(",", dto.DiasDisponiveis),
                HorarioSugerido = !string.IsNullOrEmpty(dto.HorarioSugerido) ? TimeSpan.Parse(dto.HorarioSugerido) : null,
                IdadeMinima = dto.IdadeMinima,
                IdadeMaxima = dto.IdadeMaxima,
                LimiteParticipantes = dto.LimiteParticipantes,
                Local = string.Join(",", dto.Local),
                ProfessorResponsavel = dto.ProfessorResponsavel,
                Acontecimentos = dto.Acontecimentos
            };
        }

        private static void MapDtoToEntity(AtividadeDTO dto, Atividade atividade)
        {
            atividade.Codigo = dto.Codigo;
            atividade.Nome = dto.Nome;
            atividade.Descricao = dto.Descricao;
            atividade.ImagemUrl = dto.ImagemUrl;
            atividade.ImagemFileId = dto.ImagemFileId; 
            atividade.ExigePiscina = dto.ExigePiscina;
            atividade.ExigeFisico = dto.ExigeFisico;
            atividade.Categoria = dto.Categoria;
            atividade.DiasDisponiveis = string.Join(",", dto.DiasDisponiveis);
            atividade.HorarioSugerido = !string.IsNullOrEmpty(dto.HorarioSugerido) ? TimeSpan.Parse(dto.HorarioSugerido) : null;
            atividade.IdadeMinima = dto.IdadeMinima;
            atividade.IdadeMaxima = dto.IdadeMaxima;
            atividade.LimiteParticipantes = dto.LimiteParticipantes;
            atividade.Local = string.Join(",", dto.Local);
            atividade.ProfessorResponsavel = dto.ProfessorResponsavel;
            atividade.Acontecimentos = dto.Acontecimentos;
        }
    }
}