using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Features.Messages.Dto;

namespace CoongChat.Application.Interfaces
{
    /// <summary>
    /// Interface for real-time notification services
    /// Abstracts SignalR from the Application layer
    /// </summary>
    public interface IChatNotificationService
    {
        /// <summary>
        /// Sends a new message to specific users by their IDs
        /// </summary>
        Task SendMessageToUsersAsync(List<Guid> userIds, ConversationDto conversation, MessageDto message, CancellationToken ct = default);

        /// <summary>
        /// Notifies specific users about message status changes
        /// </summary>
        Task NotifyMessageStatusChangedAsync(List<Guid> userIds, Guid messageId, Guid userId, int status, CancellationToken ct = default);
    }
}

