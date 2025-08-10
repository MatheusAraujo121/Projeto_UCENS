namespace userApi.Domain.Entities
{
    public class Presidentes
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }

        public DateTime DataPosse { get; set; }
        public DateTime DataExoneracao { get; set; }


    }
}
