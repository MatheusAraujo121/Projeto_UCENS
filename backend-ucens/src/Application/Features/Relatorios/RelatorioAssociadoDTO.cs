using System;
using System.Collections.Generic;

namespace Application.Features.Relatorios
{
    public class RelatorioAssociadoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string? StatusQuo { get; set; }
        public List<RelatorioDependenteDTO> Dependentes { get; set; } = new();
    }

    public class RelatorioDependenteDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string? GrauParentesco { get; set; }
    }
}