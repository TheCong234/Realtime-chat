using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoongChat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastMessageToConversation2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Messages_LastMessageId1",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_LastMessageId1",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "LastMessageId1",
                table: "Conversations");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_LastMessageId",
                table: "Conversations",
                column: "LastMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Messages_LastMessageId",
                table: "Conversations",
                column: "LastMessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Messages_LastMessageId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_LastMessageId",
                table: "Conversations");

            migrationBuilder.AddColumn<Guid>(
                name: "LastMessageId1",
                table: "Conversations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_LastMessageId1",
                table: "Conversations",
                column: "LastMessageId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Messages_LastMessageId1",
                table: "Conversations",
                column: "LastMessageId1",
                principalTable: "Messages",
                principalColumn: "Id");
        }
    }
}
