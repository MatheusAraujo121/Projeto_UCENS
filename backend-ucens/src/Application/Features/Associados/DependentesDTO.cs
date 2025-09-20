using System;

namespace Application.Features.Associados
{
    public class DependentesDTO
    {
        public int Id { get; set; }
        public int AssociadoId { get; set; } 
        public string? Situacao { get; set; }
        public string? GrauParentesco { get; set; }
        public DateTime? DataLimite { get; set; }

        public string Nome { get; set; } = string.Empty; 
        public string? Cognome { get; set; }
        public string? NumeroCarteirinha { get; set; } 
        public string? Categoria { get; set; }
        public DateTime? ValidadeCarteirinha { get; set; } 

        public string? Sexo { get; set; }
        public string? Cpf { get; set; }
        public string? Rg { get; set; }
        
        public DateTime DataNascimento { get; set; }
        public string? LocalNascimento { get; set; }
        public string? Nacionalidade { get; set; }
        public string? EstadoCivil { get; set; }
        public string? GrauInstrucao { get; set; }
        public string? Profissao { get; set; }
        
        public string? Exames { get; set; }
        public string? AtividadesProibidas { get; set; }
    }
}