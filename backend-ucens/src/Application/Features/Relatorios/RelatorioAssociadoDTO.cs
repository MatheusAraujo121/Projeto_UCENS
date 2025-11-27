using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; 

namespace Application.Features.Relatorios
{
    public class RelatorioAssociadoDTO
    {
        public int Id { get; set; }

        [StringLength(150)]
        public string Nome { get; set; } = string.Empty;

        [StringLength(14)] 
        public string CPF { get; set; } = string.Empty;

        [StringLength(30)] 
        public string? Situacao { get; set; }

        public List<RelatorioDependenteDTO> Dependentes { get; set; } = new();
    }

    public class RelatorioDependenteDTO
    {
        public int Id { get; set; }

        [StringLength(150)] 
        public string Nome { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        [StringLength(50)] 
        public string? GrauParentesco { get; set; }
    }
}