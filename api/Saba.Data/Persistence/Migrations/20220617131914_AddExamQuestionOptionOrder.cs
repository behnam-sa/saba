using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saba.Data.Persistence.Migrations
{
    public partial class AddExamQuestionOptionOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Question",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Option",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Exam",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Option");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Exam");
        }
    }
}
