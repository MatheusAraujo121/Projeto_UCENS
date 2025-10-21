using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Relatorios
{
    public class RelatorioAssociadoDTO
    {
        public int Id { get; set; }

        [StringLength(150)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [StringLength(14)] // Adicionado
        public string CPF { get; set; } = string.Empty;

        [StringLength(30)] // Adicionado
        public string? Situacao { get; set; }

        public List<RelatorioDependenteDTO> Dependentes { get; set; } = new();
    }

    public class RelatorioDependenteDTO
    {
        public int Id { get; set; }

        [StringLength(150)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        [StringLength(50)] // Adicionado
        public string? GrauParentesco { get; set; }
    }
}