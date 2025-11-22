using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GerenciamentoZoo.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCuidadorFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Cuidados",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Cargo",
                table: "Cuidados",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "Cuidados");

            migrationBuilder.DropColumn(
                name: "Cargo",
                table: "Cuidados");
        }
    }
}
