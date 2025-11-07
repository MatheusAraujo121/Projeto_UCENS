using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaFinanceiro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiasParaProtesto",
                table: "Boletos");

            migrationBuilder.DropColumn(
                name: "EspecieDocumento",
                table: "Boletos");

            migrationBuilder.RenameColumn(
                name: "Aceite",
                table: "Boletos",
                newName: "SequencialNossoNumero");

            migrationBuilder.AlterColumn<decimal>(
                name: "PercentualMulta",
                table: "Boletos",
                type: "decimal(18, 2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18, 2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "JurosMora",
                table: "Boletos",
                type: "decimal(18, 2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18, 2)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroArquivoRemessa",
                table: "Boletos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Bairro",
                table: "Associados",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cidade",
                table: "Associados",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UF",
                table: "Associados",
                type: "TEXT",
                maxLength: 2,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroArquivoRemessa",
                table: "Boletos");

            migrationBuilder.DropColumn(
                name: "Bairro",
                table: "Associados");

            migrationBuilder.DropColumn(
                name: "Cidade",
                table: "Associados");

            migrationBuilder.DropColumn(
                name: "UF",
                table: "Associados");

            migrationBuilder.RenameColumn(
                name: "SequencialNossoNumero",
                table: "Boletos",
                newName: "Aceite");

            migrationBuilder.AlterColumn<decimal>(
                name: "PercentualMulta",
                table: "Boletos",
                type: "decimal(18, 2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18, 2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "JurosMora",
                table: "Boletos",
                type: "decimal(18, 2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18, 2)");

            migrationBuilder.AddColumn<int>(
                name: "DiasParaProtesto",
                table: "Boletos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EspecieDocumento",
                table: "Boletos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
