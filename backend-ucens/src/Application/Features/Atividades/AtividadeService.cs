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

        public AtividadeService(IRepository<Atividade> repo)
        {
            _repo = repo;
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
            dto.Id = atividade.Id;
            return dto;
        }

        public async Task<AtividadeDTO> Update(int id, AtividadeDTO dto)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                throw new Exception($"Atividade com ID {id} não encontrada.");
            }

            MapDtoToEntity(dto, atividade);

            await _repo.Update(atividade);
            return MapToDto(atividade);
        }

        public async Task Delete(int id, string webRootPath)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
            {
                return;
            }

            if (!string.IsNullOrEmpty(atividade.ImagemUrl))
            {
                try
                {
                    var fileName = Path.GetFileName(new Uri(atividade.ImagemUrl).AbsolutePath);
                    var filePath = Path.Combine(webRootPath, "images", "activities", fileName);

                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao deletar arquivo de imagem: {ex.Message}");
                }
            }

            await _repo.Delete(id);
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