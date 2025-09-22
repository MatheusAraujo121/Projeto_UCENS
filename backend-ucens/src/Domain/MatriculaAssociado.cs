namespace Domain
{
    public class MatriculaAssociado
    {
        public int AssociadoId { get; set; }
        public Associado Associado { get; set; } = null!;

        public int TurmaId { get; set; }
        public Turma Turma { get; set; } = null!;
    }
}