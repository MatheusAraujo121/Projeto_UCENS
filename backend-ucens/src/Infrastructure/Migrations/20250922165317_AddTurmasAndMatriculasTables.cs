using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTurmasAndMatriculasTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Turmas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Professor = table.Column<string>(type: "TEXT", nullable: true),
                    DiasHorarios = table.Column<string>(type: "TEXT", nullable: true),
                    Vagas = table.Column<int>(type: "INTEGER", nullable: false),
                    AtividadeId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Turmas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Turmas_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatriculasAssociados",
                columns: table => new
                {
                    AssociadoId = table.Column<int>(type: "INTEGER", nullable: false),
                    TurmaId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatriculasAssociados", x => new { x.AssociadoId, x.TurmaId });
                    table.ForeignKey(
                        name: "FK_MatriculasAssociados_Associados_AssociadoId",
                        column: x => x.AssociadoId,
                        principalTable: "Associados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatriculasAssociados_Turmas_TurmaId",
                        column: x => x.TurmaId,
                        principalTable: "Turmas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatriculasDependentes",
                columns: table => new
                {
                    DependenteId = table.Column<int>(type: "INTEGER", nullable: false),
                    TurmaId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatriculasDependentes", x => new { x.DependenteId, x.TurmaId });
                    table.ForeignKey(
                        name: "FK_MatriculasDependentes_Dependentes_DependenteId",
                        column: x => x.DependenteId,
                        principalTable: "Dependentes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatriculasDependentes_Turmas_TurmaId",
                        column: x => x.TurmaId,
                        principalTable: "Turmas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatriculasAssociados_TurmaId",
                table: "MatriculasAssociados",
                column: "TurmaId");

            migrationBuilder.CreateIndex(
                name: "IX_MatriculasDependentes_TurmaId",
                table: "MatriculasDependentes",
                column: "TurmaId");

            migrationBuilder.CreateIndex(
                name: "IX_Turmas_AtividadeId",
                table: "Turmas",
                column: "AtividadeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatriculasAssociados");

            migrationBuilder.DropTable(
                name: "MatriculasDependentes");

            migrationBuilder.DropTable(
                name: "Turmas");
        }
    }
}
