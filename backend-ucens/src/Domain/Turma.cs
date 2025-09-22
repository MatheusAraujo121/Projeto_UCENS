using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Turma
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Professor { get; set; }
        public string? DiasHorarios { get; set; } 
        public int Vagas { get; set; }

        public int AtividadeId { get; set; }
        [JsonIgnore]
        public Atividade Atividade { get; set; } = null!;

        public ICollection<MatriculaAssociado> MatriculasAssociados { get; set; } = new List<MatriculaAssociado>();

        public ICollection<MatriculaDependente> MatriculasDependentes { get; set; } = new List<MatriculaDependente>();
    }
}