using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBoletoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Boletos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AssociadoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataEmissao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataPagamento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ValorPago = table.Column<decimal>(type: "decimal(18, 2)", nullable: true),
                    NossoNumero = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    Aceite = table.Column<bool>(type: "INTEGER", nullable: false),
                    EspecieDocumento = table.Column<string>(type: "TEXT", nullable: false),
                    JurosMora = table.Column<decimal>(type: "decimal(18, 2)", nullable: true),
                    PercentualMulta = table.Column<decimal>(type: "decimal(18, 2)", nullable: true),
                    DiasParaProtesto = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boletos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boletos_Associados_AssociadoId",
                        column: x => x.AssociadoId,
                        principalTable: "Associados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_AssociadoId",
                table: "Boletos",
                column: "AssociadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Boletos");
        }
    }
}
