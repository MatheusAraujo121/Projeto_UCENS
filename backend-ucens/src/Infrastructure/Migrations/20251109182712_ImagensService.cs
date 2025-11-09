using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ImagensService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagemFileId",
                table: "Eventos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagemFileId",
                table: "CarouselImages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagemFileId",
                table: "Atividades",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagemFileId",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "ImagemFileId",
                table: "CarouselImages");

            migrationBuilder.DropColumn(
                name: "ImagemFileId",
                table: "Atividades");
        }
    }
}
