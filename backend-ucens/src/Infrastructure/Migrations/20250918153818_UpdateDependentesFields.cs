using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDependentesFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Sexo",
                table: "Dependentes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Rg",
                table: "Dependentes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "NomePai",
                table: "Dependentes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "NomeMae",
                table: "Dependentes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "AtividadesProibidas",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cognome",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cpf",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataLimite",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstadoCivil",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Exames",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GrauInstrucao",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GrauParentesco",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocalNascimento",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nacionalidade",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NumeroCarteirinha",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Profissao",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Situacao",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidadeCarteirinha",
                table: "Dependentes",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AtividadesProibidas",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Cognome",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Cpf",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "DataLimite",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "EstadoCivil",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Exames",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "GrauInstrucao",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "GrauParentesco",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "LocalNascimento",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Nacionalidade",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "NumeroCarteirinha",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Profissao",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "Situacao",
                table: "Dependentes");

            migrationBuilder.DropColumn(
                name: "ValidadeCarteirinha",
                table: "Dependentes");

            migrationBuilder.AlterColumn<string>(
                name: "Sexo",
                table: "Dependentes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Rg",
                table: "Dependentes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NomePai",
                table: "Dependentes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NomeMae",
                table: "Dependentes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
