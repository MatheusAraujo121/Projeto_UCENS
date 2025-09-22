namespace Domain
{
    public class MatriculaDependente
    {
        public int DependenteId { get; set; }
        public Dependente Dependente { get; set; } = null!;

        public int TurmaId { get; set; }
        public Turma Turma { get; set; } = null!;
    }
}