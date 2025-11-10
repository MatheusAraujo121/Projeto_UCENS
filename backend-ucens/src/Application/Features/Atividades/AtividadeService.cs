using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Os 'using' de System.IO, Path, etc., não são mais necessários aqui
// pois o IImageKitService cuida de toda a lógica de arquivos.

namespace Application.Features.Atividades
{
    public class AtividadeService
    {
        private readonly IRepository<Atividade> _repo;
        private readonly IImageKitService _imageKitService; // <-- Adicionado

        public AtividadeService(IRepository<Atividade> repo, IImageKitService imageKitService) // <-- Injetado
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
            // O ImagemUrl e ImagemFileId já vêm do DTO,
            // preenchidos pelo frontend após o upload no FileController.
            await _repo.Add(atividade);
            
            // Retorna o DTO com o ID gerado
            return MapToDto(atividade);
        }

        // Assinatura do Update mudou (remove webRootPath)
        public async Task<AtividadeDTO> Update(int id, AtividadeDTO dto)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                throw new Exception($"Atividade com ID {id} não encontrada.");
            }
            
            // Salva o FileId antigo ANTES de mapear os novos dados
            string? oldFileId = atividade.ImagemFileId; 

            // Mapeia *todos* os campos do DTO para a entidade existente
            MapDtoToEntity(dto, atividade);

            await _repo.Update(atividade);

            // Compara o FileId antigo com o novo (que veio do DTO)
            // Se mudou (ou foi removido), deleta o arquivo antigo do ImageKit
            if (!string.IsNullOrEmpty(oldFileId) && oldFileId != atividade.ImagemFileId)
            {
                await _imageKitService.DeleteAsync(oldFileId);
            }
            
            return MapToDto(atividade);
        }

        // Assinatura do Delete mudou (remove webRootPath)
        public async Task Delete(int id)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                return;
            }

            // Pega o FileId ANTES de deletar do banco
            string? fileIdToDelete = atividade.ImagemFileId; 

            await _repo.Delete(id); // Deleta do banco

            // Deleta do ImageKit (APÓS deletar do banco)
            if (!string.IsNullOrEmpty(fileIdToDelete))
            {
                await _imageKitService.DeleteAsync(fileIdToDelete);
            }
        }
        
        // --- MÉTODOS DE MAPEAMENTO ---

        private static AtividadeDTO MapToDto(Atividade atividade)
        {
            return new AtividadeDTO
            {
                Id = atividade.Id,
                Codigo = atividade.Codigo,
                Nome = atividade.Nome,
                Descricao = atividade.Descricao,
                ImagemUrl = atividade.ImagemUrl,
                ImagemFileId = atividade.ImagemFileId, // <-- Adicionado
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
                ImagemFileId = dto.ImagemFileId, // <-- Adicionado
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
            // Mapeia todos os campos do DTO para a entidade existente
            atividade.Codigo = dto.Codigo;
            atividade.Nome = dto.Nome;
            atividade.Descricao = dto.Descricao;
            atividade.ImagemUrl = dto.ImagemUrl;
            atividade.ImagemFileId = dto.ImagemFileId; // <-- Adicionado
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