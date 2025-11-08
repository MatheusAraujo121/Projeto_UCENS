using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet; // (Ignore o erro vermelho)
using CloudinaryDotNet.Actions; // (Ignore o erro vermelho)
using System.IO; 

namespace Application.Features.Atividades
{
    public class AtividadeService
    {
        private readonly IRepository<Atividade> _repo;
        private readonly Cloudinary _cloudinary; // <-- Adicionado

        // Injete o Cloudinary
        public AtividadeService(IRepository<Atividade> repo, Cloudinary cloudinary)
        {
            _repo = repo;
            _cloudinary = cloudinary;
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

        // --- MÉTODO UPDATE MODIFICADO ---
        // Remova 'webRootPath'
        public async Task<AtividadeDTO> Update(int id, AtividadeDTO dto)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null)
                throw new Exception($"Atividade com ID {id} não encontrada.");
            
            // Se a URL da imagem mudou, delete a antiga do Cloudinary
            if (!string.IsNullOrEmpty(atividade.ImagemUrl) && atividade.ImagemUrl != dto.ImagemUrl)
            {
                try
                {
                    var publicId = GetPublicIdFromUrl(atividade.ImagemUrl);
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

            MapDtoToEntity(dto, atividade);
            await _repo.Update(atividade);
            return MapToDto(atividade);
        }

        // --- MÉTODO DELETE MODIFICADO ---
        // Remova 'webRootPath'
        public async Task Delete(int id)
        {
            var atividade = await _repo.GetById(id);
            if (atividade == null) return;

            // Deleta a imagem do Cloudinary
            if (!string.IsNullOrEmpty(atividade.ImagemUrl))
            {
                try
                {
                    var publicId = GetPublicIdFromUrl(atividade.ImagemUrl);
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
                return Path.ChangeExtension(path, null); // Retorna "activities/nomearquivo"
            }
            catch { return null; }
        }

        // --- Funções de Map (sem mudança) ---
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