using Application.Common.Interfaces;
using Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Features.Associados
{
    public class DependentesService
    {
        private readonly IRepository<Dependente> _repo;
        private readonly IAssociadoRepository _associadoRepo; 

        public DependentesService(IRepository<Dependente> repo, IAssociadoRepository associadoRepo)
        {
            _repo = repo;
            _associadoRepo = associadoRepo;
        }

        public Task<IEnumerable<Dependente>> GetAll() => _repo.GetAll();
        public Task<Dependente?> GetById(int id) => _repo.GetById(id);

        public async Task<Dependente> Add(DependentesDTO dto)
        {
            var associado = await _associadoRepo.GetById(dto.AssociadoId);
            if (associado == null)
            {
                throw new System.Exception($"Associado com ID {dto.AssociadoId} não encontrado.");
            }

            var dependente = new Dependente
            {
                AssociadoId = dto.AssociadoId,
                Situacao = dto.Situacao,
                GrauParentesco = dto.GrauParentesco,
                Nome = dto.Nome,
                Cognome = dto.Cognome,
                NumeroCarteirinha = dto.NumeroCarteirinha,
                Categoria = dto.Categoria,
                ValidadeCarteirinha = dto.ValidadeCarteirinha,
                Sexo = dto.Sexo,
                Cpf = dto.Cpf,
                Rg = dto.Rg,
                DataNascimento = dto.DataNascimento,
                LocalNascimento = dto.LocalNascimento,
                Nacionalidade = dto.Nacionalidade,
                EstadoCivil = dto.EstadoCivil,
                GrauInstrucao = dto.GrauInstrucao,
                Profissao = dto.Profissao,
                Exames = dto.Exames,
                AtividadesProibidas = dto.AtividadesProibidas
            };
            
            return await _repo.Add(dependente);
        }

        public async Task<Dependente> Update(int id, DependentesDTO dto)
        {
            var dependente = await _repo.GetById(id);
            if (dependente == null)
            {
                throw new System.Exception($"Dependente com ID {id} não encontrado.");
            }
            
            var associado = await _associadoRepo.GetById(dto.AssociadoId);
            if (associado == null)
            {
                throw new System.Exception($"Associado com ID {dto.AssociadoId} não encontrado.");
            }

            dependente.Nome = dto.Nome;
            dependente.Rg = dto.Rg;
            dependente.DataNascimento = dto.DataNascimento;
            dependente.Sexo = dto.Sexo;
            dependente.Situacao = dto.Situacao;
            dependente.GrauParentesco = dto.GrauParentesco;
            dependente.Cognome = dto.Cognome;
            dependente.NumeroCarteirinha = dto.NumeroCarteirinha;
            dependente.Categoria = dto.Categoria;
            dependente.ValidadeCarteirinha = dto.ValidadeCarteirinha;
            dependente.Cpf = dto.Cpf;
            dependente.LocalNascimento = dto.LocalNascimento;
            dependente.Nacionalidade = dto.Nacionalidade;
            dependente.EstadoCivil = dto.EstadoCivil;
            dependente.GrauInstrucao = dto.GrauInstrucao;
            dependente.Profissao = dto.Profissao;
            dependente.Exames = dto.Exames;
            dependente.AtividadesProibidas = dto.AtividadesProibidas;
            dependente.AssociadoId = dto.AssociadoId;

            return await _repo.Update(dependente);
        }
        public Task Delete(int id) => _repo.Delete(id);
    }
}