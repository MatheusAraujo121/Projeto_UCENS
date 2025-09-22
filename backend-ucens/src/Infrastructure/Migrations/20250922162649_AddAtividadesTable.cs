using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAtividadesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Atividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Codigo = table.Column<string>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    ImagemUrl = table.Column<string>(type: "TEXT", nullable: true),
                    ExigePiscina = table.Column<bool>(type: "INTEGER", nullable: false),
                    ExigeFisico = table.Column<bool>(type: "INTEGER", nullable: false),
                    Categoria = table.Column<string>(type: "TEXT", nullable: true),
                    DiasDisponiveis = table.Column<string>(type: "TEXT", nullable: true),
                    HorarioSugerido = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    IdadeMinima = table.Column<int>(type: "INTEGER", nullable: true),
                    IdadeMaxima = table.Column<int>(type: "INTEGER", nullable: true),
                    LimiteParticipantes = table.Column<int>(type: "INTEGER", nullable: true),
                    Local = table.Column<string>(type: "TEXT", nullable: true),
                    ProfessorResponsavel = table.Column<string>(type: "TEXT", nullable: true),
                    Acontecimentos = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atividades", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Atividades");
        }
    }
}
