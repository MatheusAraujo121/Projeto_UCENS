using Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Relatorios
{
    public class RelatorioService
    {
        private readonly IAssociadoRepository _associadoRepo;

        public RelatorioService(IAssociadoRepository associadoRepo)
        {
            _associadoRepo = associadoRepo;
        }

        public async Task<List<RelatorioAssociadoDTO>> GerarRelatorioAssociadosComDependentes()
        {
            var associados = await _associadoRepo.GetAllWithDependentes();

            return associados.Select(a => new RelatorioAssociadoDTO
            {
                Id = a.Id,
                Nome = a.Nome,
                CPF = a.CPF,
                StatusQuo = a.StatusQuo,
                Dependentes = a.Dependentes.Select(d => new RelatorioDependenteDTO
                {
                    Id = d.Id,
                    Nome = d.Nome,
                    DataNascimento = d.DataNascimento,
                    GrauParentesco = d.GrauParentesco
                }).ToList()
            }).ToList();
        }
    }
}