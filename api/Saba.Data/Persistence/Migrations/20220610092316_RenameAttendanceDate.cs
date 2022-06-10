using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saba.Data.Persistence.Migrations
{
    public partial class RenameAttendanceDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Created",
                table: "Attendance",
                newName: "AttendanceDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttendanceDate",
                table: "Attendance",
                newName: "Created");
        }
    }
}
