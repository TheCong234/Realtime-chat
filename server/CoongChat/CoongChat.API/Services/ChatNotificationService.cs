using CoongChat.API.Hubs;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace CoongChat.API.Services
{
    /// <summary>
    /// Implementation of IChatNotificationService using SignalR
    /// </summary>
    public class ChatNotificationService : IChatNotificationService
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IUserConnectionRepository _userConnectionRepository;

        public ChatNotificationService(
            IHubContext<ChatHub> hubContext,
            IUserConnectionRepository userConnectionRepository)
        {
            _hubContext = hubContext;
            _userConnectionRepository = userConnectionRepository;
        }

        public async Task SendMessageToUsersAsync(List<Guid> userIds, ConversationDto conversation, MessageDto message, CancellationToken ct = default)
        {
            // Get all connection IDs for the target users
            var connectionIds = new List<string>();
            foreach (var userId in userIds)
            {
                var userConnections = await _userConnectionRepository.GetConnectionIdsByUserIdAsync(userId, ct);
                connectionIds.AddRange(userConnections);
            }

            if (connectionIds.Count > 0)
            {
                await _hubContext.Clients
                    .Clients(connectionIds)
                    .SendAsync("ReceiveMessage", conversation, message, ct);
            }
        }

        public async Task NotifyMessageStatusChangedAsync(List<Guid> userIds, Guid messageId, Guid userId, int status, CancellationToken ct = default)
        {
            // Get all connection IDs for the target users
            var connectionIds = new List<string>();
            foreach (var uid in userIds)
            {
                var userConnections = await _userConnectionRepository.GetConnectionIdsByUserIdAsync(uid, ct);
                connectionIds.AddRange(userConnections);
            }

            if (connectionIds.Count > 0)
            {
                await _hubContext.Clients
                    .Clients(connectionIds)
                    .SendAsync("MessageStatusChanged", new
                    {
                        MessageId = messageId,
                        UserId = userId,
                        Status = status
                    }, ct);
            }
        }

        public async Task NotifyMessageRecalledAsync(List<Guid> userIds, Guid conversationId, Guid messageId, CancellationToken ct = default)
        {
            var connectionIds = new List<string>();
            foreach (var userId in userIds)
            {
                var userConnections = await _userConnectionRepository.GetConnectionIdsByUserIdAsync(userId, ct);
                connectionIds.AddRange(userConnections);
            }

            if (connectionIds.Count > 0)
            {
                await _hubContext.Clients
                    .Clients(connectionIds)
                    .SendAsync("MessageRecalled", new
                    {
                        ConversationId = conversationId,
                        MessageId = messageId
                    }, ct);
            }
        }
    }
}

