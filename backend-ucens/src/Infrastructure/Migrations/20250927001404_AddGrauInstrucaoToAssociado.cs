using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGrauInstrucaoToAssociado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StatusQuo",
                table: "Associados",
                newName: "Situacao");

            migrationBuilder.AddColumn<string>(
                name: "GrauInstrucao",
                table: "Associados",
                type: "TEXT",
                maxLength: 30,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrauInstrucao",
                table: "Associados");

            migrationBuilder.RenameColumn(
                name: "Situacao",
                table: "Associados",
                newName: "StatusQuo");
        }
    }
}
