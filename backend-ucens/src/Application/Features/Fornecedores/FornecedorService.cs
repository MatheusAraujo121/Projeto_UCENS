using Application.Common.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Fornecedores
{
    public class FornecedorService
    {
        private readonly IFornecedorRepository _repo;
        private readonly IRepository<Despesa> _despesaRepo;

        public FornecedorService(IFornecedorRepository repo, IRepository<Despesa> despesaRepo)
        {
            _repo = repo;
            _despesaRepo = despesaRepo;
        }

        public async Task<List<FornecedorDTO>> GetAll()
        {
            var fornecedores = await _repo.GetAllWithDespesasAsync();
            return fornecedores.Select(MapToDto).ToList();
        }

        public async Task<FornecedorDTO?> GetById(int id)
        {
            var fornecedor = await _repo.GetByIdWithDespesasAsync(id);
            return fornecedor == null ? null : MapToDto(fornecedor);
        }

        public async Task<FornecedorDTO> Add(FornecedorDTO dto)
        {
            var fornecedor = new Fornecedor
            {
                Nome = dto.Nome,
                Cnpj = dto.Cnpj,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Responsavel = dto.Responsavel,
                Ativo = dto.Ativo,
                LimiteCredito = dto.LimiteCredito,
                Observacoes = dto.Observacoes
            };

            await _repo.Add(fornecedor);
            dto.Id = fornecedor.Id;
            return dto;
        }

        public async Task<FornecedorDTO> Update(int id, FornecedorDTO dto)
        {
            var fornecedor = await _repo.GetById(id);
            if (fornecedor == null)
            {
                throw new Exception($"Fornecedor com ID {id} não encontrado.");
            }

            fornecedor.Nome = dto.Nome;
            fornecedor.Cnpj = dto.Cnpj;
            fornecedor.Telefone = dto.Telefone;
            fornecedor.Email = dto.Email;
            fornecedor.Responsavel = dto.Responsavel;
            fornecedor.Ativo = dto.Ativo;
            fornecedor.LimiteCredito = dto.LimiteCredito;
            fornecedor.Observacoes = dto.Observacoes;

            await _repo.Update(fornecedor);
            return dto;
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }

        public async Task<DespesaDTO> AddDespesa(DespesaDTO dto)
        {
            var despesa = MapToEntity(dto);
            await _despesaRepo.Add(despesa);
            dto.Id = despesa.Id;
            return dto;
        }

        public async Task<DespesaDTO> UpdateDespesa(int id, DespesaDTO dto)
        {
            var despesa = await _despesaRepo.GetById(id);
            if (despesa == null)
            {
                throw new Exception($"Despesa com ID {id} não encontrada.");
            }

            MapDtoToEntity(dto, despesa);
            await _despesaRepo.Update(despesa);
            return dto;
        }

        public async Task DeleteDespesa(int id)
        {
            await _despesaRepo.Delete(id);
        }

        public async Task<DespesaDTO> GetDespesaById(int id)
        {
            var despesa = await _despesaRepo.GetById(id);
            if (despesa == null)
            {
                throw new Exception($"Despesa com ID {id} não encontrada.");
            }
            return MapToDespesaDto(despesa);
        }

        private DespesaDTO MapToDespesaDto(Despesa d)
        {
            return new DespesaDTO
            {
                Id = d.Id,
                Descricao = d.Descricao,
                Categoria = d.Categoria,
                Status = d.Status,
                Valor = d.Valor,
                DataVencimento = d.DataVencimento,
                DataPagamento = d.DataPagamento,
                FormaPagamento = d.FormaPagamento,
                NumeroFatura = d.NumeroFatura,
                MultaJuros = d.MultaJuros,
                Observacoes = d.Observacoes,
                AnexoUrl = d.AnexoUrl,
                FornecedorId = d.FornecedorId
            };
        }

        private FornecedorDTO MapToDto(Fornecedor f)
        {
            return new FornecedorDTO
            {
                Id = f.Id,
                Nome = f.Nome,
                Cnpj = f.Cnpj,
                Telefone = f.Telefone,
                Email = f.Email,
                Responsavel = f.Responsavel,
                Ativo = f.Ativo,
                LimiteCredito = f.LimiteCredito,
                Observacoes = f.Observacoes,
                Despesas = f.Despesas.Select(d => new DespesaDTO
                {
                    Id = d.Id,
                    Descricao = d.Descricao,
                    Categoria = d.Categoria,
                    Status = d.Status,
                    Valor = d.Valor,
                    DataVencimento = d.DataVencimento,
                    DataPagamento = d.DataPagamento,
                    FormaPagamento = d.FormaPagamento,
                    NumeroFatura = d.NumeroFatura,
                    MultaJuros = d.MultaJuros,
                    Observacoes = d.Observacoes,
                    AnexoUrl = d.AnexoUrl,
                    FornecedorId = d.FornecedorId
                }).ToList()
            };
        }

        private Despesa MapToEntity(DespesaDTO dto)
        {
            return new Despesa
            {
                Id = dto.Id,
                Descricao = dto.Descricao,
                Categoria = dto.Categoria,
                Status = dto.Status,
                Valor = dto.Valor,
                DataVencimento = dto.DataVencimento,
                DataPagamento = dto.DataPagamento,
                FormaPagamento = dto.FormaPagamento,
                NumeroFatura = dto.NumeroFatura,
                MultaJuros = dto.MultaJuros,
                Observacoes = dto.Observacoes,
                AnexoUrl = dto.AnexoUrl,
                FornecedorId = dto.FornecedorId
            };
        }

        private void MapDtoToEntity(DespesaDTO dto, Despesa despesa)
        {
            despesa.Descricao = dto.Descricao;
            despesa.Categoria = dto.Categoria;
            despesa.Status = dto.Status;
            despesa.Valor = dto.Valor;
            despesa.DataVencimento = dto.DataVencimento;
            despesa.DataPagamento = dto.DataPagamento;
            despesa.FormaPagamento = dto.FormaPagamento;
            despesa.NumeroFatura = dto.NumeroFatura;
            despesa.MultaJuros = dto.MultaJuros;
            despesa.Observacoes = dto.Observacoes;
            despesa.AnexoUrl = dto.AnexoUrl;
            despesa.FornecedorId = dto.FornecedorId;
        }
    }
}