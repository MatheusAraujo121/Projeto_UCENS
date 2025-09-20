using Application.Common.Interfaces;
using Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Associados
{
    public class AssociadoService
    {
        private readonly IRepository<Associado> _repo; 

        public AssociadoService(IRepository<Associado> repo)
        {
            _repo = repo;
        }

        public async Task<List<AssociadoDto>> GetAll()
        {
            var associados = await _repo.GetAll();
            return associados.Select(a => new AssociadoDto
            {
                Id = a.Id,
                Nome = a.Nome,
                CPF = a.CPF,
                DataNascimento = a.DataNascimento,
                Dependentes = a.Dependentes.Select(d => new DependentesDTO
                {
                    Id = d.Id,
                    Nome = d.Nome,
                    DataNascimento = d.DataNascimento,
                    AssociadoId = d.AssociadoId
                }).ToList()
            }).ToList();
        }

        public async Task<AssociadoDto?> GetById(int id)
        {
            var a = await _repo.GetById(id);
            if (a == null) return null;

            return new AssociadoDto
            {
                Id = a.Id,
                Nome = a.Nome,
                CPF = a.CPF,
                DataNascimento = a.DataNascimento,
                Dependentes = a.Dependentes.Select(d => new DependentesDTO
                {
                    Id = d.Id,
                    Nome = d.Nome,
                    DataNascimento = d.DataNascimento,
                    AssociadoId = d.AssociadoId
                }).ToList()
            };
        }

        public async Task<AssociadoDto> Add(AssociadoDto dto)
        {
            var associado = new Associado
            {
                Nome = dto.Nome,
                CPF = dto.CPF,
                DataNascimento = dto.DataNascimento,
                Email = dto.Email,
                Cognome = dto.Cognome,
                Rg = dto.Rg,
                Sexo = dto.Sexo,
                EstadoCivil = dto.EstadoCivil,
                NomePai = dto.NomePai,
                NomeMae = dto.NomeMae,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Telefone = dto.Telefone,
                LocalNascimento = dto.LocalNascimento,
                Nacionalidade = dto.Nacionalidade,
                Profissao = dto.Profissao,
                StatusQuo = dto.StatusQuo
            };

            await _repo.Add(associado);

            dto.Id = associado.Id;
            return dto;
        }

        public async Task<AssociadoDto> Update(AssociadoDto dto)
        {
            var associado = await _repo.GetById(dto.Id);
            if (associado == null) throw new System.Exception("Associado não encontrado");

            associado.Nome = dto.Nome;
            associado.CPF = dto.CPF;
            associado.DataNascimento = dto.DataNascimento;


            await _repo.Update(associado);

            return dto;
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }
    }
}