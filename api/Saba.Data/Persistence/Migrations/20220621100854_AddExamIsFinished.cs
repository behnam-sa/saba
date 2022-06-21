using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saba.Data.Persistence.Migrations
{
    public partial class AddExamIsFinished : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "Attempt");

            migrationBuilder.AddColumn<DateTime>(
                name: "FinishTime",
                table: "Attempt",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFinished",
                table: "Attempt",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinishTime",
                table: "Attempt");

            migrationBuilder.DropColumn(
                name: "IsFinished",
                table: "Attempt");

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "Attempt",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
