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
                Email = a.Email,
                Cognome = a.Cognome,
                CPF = a.CPF,
                Rg = a.Rg,
                DataNascimento = a.DataNascimento,
                Sexo = a.Sexo,
                EstadoCivil = a.EstadoCivil,
                NomePai = a.NomePai,
                NomeMae = a.NomeMae,
                Endereco = a.Endereco,
                Numero = a.Numero,
                Complemento = a.Complemento,
                Telefone = a.Telefone,
                LocalNascimento = a.LocalNascimento,
                Nacionalidade = a.Nacionalidade,
                Profissao = a.Profissao,
                Situacao = a.Situacao,
                GrauInstrucao = a.GrauInstrucao,
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
                Email = a.Email,
                Cognome = a.Cognome,
                CPF = a.CPF,
                Rg = a.Rg,
                DataNascimento = a.DataNascimento,
                Sexo = a.Sexo,
                EstadoCivil = a.EstadoCivil,
                NomePai = a.NomePai,
                NomeMae = a.NomeMae,
                Endereco = a.Endereco,
                Numero = a.Numero,
                Complemento = a.Complemento,
                Telefone = a.Telefone,
                LocalNascimento = a.LocalNascimento,
                Nacionalidade = a.Nacionalidade,
                Profissao = a.Profissao,
                Situacao = a.Situacao,
                GrauInstrucao = a.GrauInstrucao,
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
                Cognome = dto.Cognome,
                CPF = dto.CPF,
                Rg = dto.Rg,
                DataNascimento = dto.DataNascimento,
                Sexo = dto.Sexo,
                EstadoCivil = dto.EstadoCivil,
                NomePai = dto.NomePai,
                NomeMae = dto.NomeMae,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                LocalNascimento = dto.LocalNascimento,
                Nacionalidade = dto.Nacionalidade,
                Profissao = dto.Profissao,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Situacao = dto.Situacao,
                GrauInstrucao = dto.GrauInstrucao
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
            associado.Cognome = dto.Cognome;
            associado.CPF = dto.CPF;
            associado.Rg = dto.Rg;
            associado.DataNascimento = dto.DataNascimento;
            associado.Sexo = dto.Sexo;
            associado.EstadoCivil = dto.EstadoCivil;
            associado.NomePai = dto.NomePai;
            associado.NomeMae = dto.NomeMae;
            associado.Endereco = dto.Endereco;
            associado.Numero = dto.Numero;
            associado.Complemento = dto.Complemento;
            associado.LocalNascimento = dto.LocalNascimento;
            associado.Nacionalidade = dto.Nacionalidade;
            associado.Profissao = dto.Profissao;
            associado.Telefone = dto.Telefone;
            associado.Email = dto.Email;
            associado.Situacao = dto.Situacao;
            associado.GrauInstrucao = dto.GrauInstrucao;

            await _repo.Update(associado);

            return dto;
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }
    }
}